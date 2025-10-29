/**
 * CV Analysis Engine
 * 
 * Analyzes CV text content and generates:
 * - Overall quality score (0-100)
 * - Section detection and completeness
 * - Keyword density analysis
 * - Action verb detection
 * - Quantifiable achievement detection
 * - ATS compatibility assessment
 */

import {
  CVAnalysisResult,
  CVAnalysisCriteria,
  SectionCompleteness,
  Improvement,
  CVUploadException,
  ErrorCodes,
} from '../types/cv.types.js';
import { logCVAnalysis } from '../utils/logger.js';

export class CVAnalysisEngine {
  // Common action verbs used in professional CVs
  private readonly ACTION_VERBS = [
    'achieved', 'accomplished', 'administered', 'analyzed', 'built', 'created',
    'delivered', 'designed', 'developed', 'directed', 'established', 'executed',
    'generated', 'implemented', 'improved', 'increased', 'initiated', 'launched',
    'led', 'managed', 'optimized', 'organized', 'planned', 'produced', 'reduced',
    'resolved', 'streamlined', 'supervised', 'trained', 'transformed',
  ];

  // Keywords that indicate professional skills and experience
  private readonly PROFESSIONAL_KEYWORDS = [
    'project', 'team', 'management', 'leadership', 'strategy', 'analysis',
    'development', 'implementation', 'optimization', 'collaboration', 'communication',
    'problem-solving', 'innovation', 'efficiency', 'quality', 'performance',
  ];

  // Section headers to detect
  private readonly SECTION_PATTERNS = {
    contact: /\b(contact|email|phone|address|linkedin)\b/i,
    summary: /\b(summary|profile|objective|about|overview)\b/i,
    experience: /\b(experience|employment|work history|career|professional background)\b/i,
    education: /\b(education|academic|qualification|degree|university|college)\b/i,
    skills: /\b(skills|competencies|expertise|technical skills|proficiencies)\b/i,
  };

  // Date patterns for experience validation
  private readonly DATE_PATTERNS = [
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b/i,
    /\b\d{1,2}\/\d{4}\b/,
    /\b\d{4}\s*-\s*\d{4}\b/,
    /\b\d{4}\s*–\s*\d{4}\b/,
    /\b\d{4}\s*to\s*\d{4}\b/i,
    /\b\d{4}\s*-\s*present\b/i,
  ];

  /**
   * Main analysis method
   */
  async analyzeCV(cvText: string): Promise<CVAnalysisResult> {
    try {
      if (!cvText || cvText.trim().length === 0) {
        throw new CVUploadException(
          ErrorCodes.ANALYSIS_FAILED,
          'CV text is empty or invalid',
          400
        );
      }

      // Analyze CV content
      const criteria = this.analyzeCriteria(cvText);
      
      // Calculate scores
      const overallScore = this.calculateOverallScore(criteria);
      const atsCompatibility = this.calculateATSCompatibility(criteria);
      
      // Identify strengths and improvements
      const strengths = this.identifyStrengths(criteria);
      const improvements = this.identifyImprovements(criteria);
      
      // Generate section completeness
      const sectionCompleteness = this.getSectionCompleteness(criteria);
      
      // Generate detailed feedback
      const detailedFeedback = this.generateDetailedFeedback(
        overallScore,
        strengths,
        improvements
      );

      return {
        overallScore,
        strengths,
        improvements,
        atsCompatibility,
        sectionCompleteness,
        detailedFeedback,
        analyzedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof CVUploadException) {
        throw error;
      }
      throw new CVUploadException(
        ErrorCodes.ANALYSIS_FAILED,
        `CV analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Analyze CV against all criteria
   */
  private analyzeCriteria(cvText: string): CVAnalysisCriteria {
    const normalizedText = this.normalizeText(cvText);
    const lines = normalizedText.split('\n');
    const words = normalizedText.split(/\s+/);

    return {
      // Content Analysis
      hasContactInfo: this.detectContactInfo(normalizedText),
      hasProfessionalSummary: this.detectSection(normalizedText, 'summary'),
      hasWorkExperience: this.detectSection(normalizedText, 'experience'),
      hasEducation: this.detectSection(normalizedText, 'education'),
      hasSkills: this.detectSection(normalizedText, 'skills'),
      
      // Quality Metrics
      wordCount: words.filter(w => w.length > 0).length,
      sentenceComplexity: this.calculateSentenceComplexity(normalizedText),
      keywordDensity: this.calculateKeywordDensity(normalizedText),
      actionVerbUsage: this.countActionVerbs(normalizedText),
      quantifiableAchievements: this.countQuantifiableAchievements(normalizedText),
      
      // ATS Compatibility
      hasStandardSections: this.hasStandardSections(normalizedText),
      usesStandardFonts: true, // Assume true for text extraction
      avoidsTables: true, // Assume true for text extraction
      avoidsImages: true, // Assume true for text extraction
      hasKeywords: this.hasRelevantKeywords(normalizedText),
      
      // Formatting
      consistentFormatting: this.checkConsistentFormatting(lines),
      appropriateLength: this.checkAppropriateLength(words.length),
      properDateFormats: this.checkDateFormats(normalizedText),
    };
  }

  /**
   * Calculate overall CV score (0-100)
   * 
   * Scoring breakdown:
   * - Contact Information: 10 points
   * - Professional Summary: 15 points
   * - Work Experience: 25 points
   * - Education: 10 points
   * - Skills Section: 15 points
   * - ATS Compatibility: 15 points
   * - Formatting & Structure: 10 points
   */
  private calculateOverallScore(criteria: CVAnalysisCriteria): number {
    let score = 0;

    // Contact Information (10 points)
    if (criteria.hasContactInfo) score += 10;

    // Professional Summary (15 points)
    if (criteria.hasProfessionalSummary) score += 15;

    // Work Experience (25 points)
    if (criteria.hasWorkExperience) {
      score += 15; // Base points for having experience
      // Bonus points for action verbs and achievements
      if (criteria.actionVerbUsage >= 5) score += 5;
      if (criteria.quantifiableAchievements >= 3) score += 5;
    }

    // Education (10 points)
    if (criteria.hasEducation) score += 10;

    // Skills Section (15 points)
    if (criteria.hasSkills) {
      score += 10; // Base points
      if (criteria.hasKeywords) score += 5; // Bonus for relevant keywords
    }

    // ATS Compatibility (15 points)
    if (criteria.hasStandardSections) score += 5;
    if (criteria.avoidsTables && criteria.avoidsImages) score += 5;
    if (criteria.hasKeywords) score += 5;

    // Formatting & Structure (10 points)
    if (criteria.appropriateLength) score += 4;
    if (criteria.consistentFormatting) score += 3;
    if (criteria.properDateFormats) score += 3;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate ATS compatibility score
   */
  private calculateATSCompatibility(criteria: CVAnalysisCriteria): number {
    let score = 0;

    if (criteria.hasStandardSections) score += 25;
    if (criteria.usesStandardFonts) score += 15;
    if (criteria.avoidsTables) score += 15;
    if (criteria.avoidsImages) score += 15;
    if (criteria.hasKeywords) score += 20;
    if (criteria.properDateFormats) score += 10;

    return Math.min(100, score);
  }

  /**
   * Identify CV strengths
   */
  private identifyStrengths(criteria: CVAnalysisCriteria): string[] {
    const strengths: string[] = [];

    if (criteria.hasContactInfo) {
      strengths.push('Clear contact information provided');
    }

    if (criteria.hasProfessionalSummary) {
      strengths.push('Includes professional summary highlighting key qualifications');
    }

    if (criteria.actionVerbUsage >= 5) {
      strengths.push(`Strong use of action verbs (${criteria.actionVerbUsage} found) to demonstrate achievements`);
    }

    if (criteria.quantifiableAchievements >= 3) {
      strengths.push(`Quantifiable achievements included (${criteria.quantifiableAchievements} found) with specific metrics`);
    }

    if (criteria.hasKeywords) {
      strengths.push('Contains relevant professional keywords for ATS optimization');
    }

    if (criteria.hasStandardSections) {
      strengths.push('Well-organized with standard CV sections');
    }

    if (criteria.appropriateLength) {
      strengths.push('Appropriate length for professional CV');
    }

    if (criteria.consistentFormatting) {
      strengths.push('Consistent formatting throughout the document');
    }

    // Ensure we have at least 3 strengths
    if (strengths.length === 0) {
      strengths.push('CV submitted for professional review');
    }

    return strengths.slice(0, 5); // Return top 5 strengths
  }

  /**
   * Identify areas for improvement with specific suggestions
   */
  private identifyImprovements(criteria: CVAnalysisCriteria): Improvement[] {
    const improvements: Improvement[] = [];

    // Missing Sections (High Priority)
    if (!criteria.hasContactInfo) {
      improvements.push({
        category: 'Contact Information',
        priority: 'high',
        issue: 'Missing or incomplete contact information',
        suggestion: 'Add clear contact details at the top of your CV including full name, phone number, professional email address, and LinkedIn profile URL',
        example: 'John Smith | john.smith@email.com | +1 (555) 123-4567 | linkedin.com/in/johnsmith',
      });
    }

    if (!criteria.hasProfessionalSummary) {
      improvements.push({
        category: 'Professional Summary',
        priority: 'high',
        issue: 'Missing professional summary or objective statement',
        suggestion: 'Add a compelling 3-4 sentence summary at the top highlighting your key skills, experience, and career objectives',
        example: 'Results-driven software engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable solutions and leading cross-functional teams.',
      });
    }

    if (!criteria.hasWorkExperience) {
      improvements.push({
        category: 'Work Experience',
        priority: 'high',
        issue: 'Missing work experience section',
        suggestion: 'Add a detailed work experience section listing your roles in reverse chronological order with company names, dates, and key achievements',
        example: 'Senior Developer | Tech Corp | Jan 2020 - Present\n• Led development of microservices architecture serving 1M+ users',
      });
    }

    if (!criteria.hasEducation) {
      improvements.push({
        category: 'Education',
        priority: 'high',
        issue: 'Missing education section',
        suggestion: 'Include your educational background with degree, institution, graduation year, and relevant coursework or honors',
        example: 'Bachelor of Science in Computer Science | University Name | 2018\nGPA: 3.8/4.0 | Dean\'s List',
      });
    }

    if (!criteria.hasSkills) {
      improvements.push({
        category: 'Skills',
        priority: 'high',
        issue: 'Missing skills section',
        suggestion: 'Add a dedicated skills section listing your technical and professional competencies relevant to your target role',
        example: 'Technical Skills: JavaScript, Python, React, Node.js, AWS, Docker\nSoft Skills: Leadership, Communication, Problem-solving',
      });
    }

    // Action Verbs (Medium Priority)
    if (criteria.actionVerbUsage < 5) {
      improvements.push({
        category: 'Action Verbs',
        priority: 'medium',
        issue: 'Limited use of strong action verbs',
        suggestion: 'Start bullet points with powerful action verbs to demonstrate your impact and achievements',
        example: 'Instead of "Responsible for managing team" use "Led cross-functional team of 8 developers to deliver project 2 weeks ahead of schedule"',
      });
    }

    // Quantifiable Achievements (Medium Priority)
    if (criteria.quantifiableAchievements < 3) {
      improvements.push({
        category: 'Quantifiable Achievements',
        priority: 'medium',
        issue: 'Lack of quantifiable achievements and metrics',
        suggestion: 'Add specific numbers, percentages, and metrics to demonstrate the impact of your work',
        example: 'Instead of "Improved system performance" use "Optimized database queries, reducing load time by 45% and improving user satisfaction by 30%"',
      });
    }

    // ATS Compatibility (Medium Priority)
    if (!criteria.hasKeywords) {
      improvements.push({
        category: 'ATS Optimization',
        priority: 'medium',
        issue: 'Insufficient relevant keywords for ATS systems',
        suggestion: 'Incorporate industry-specific keywords and skills from job descriptions throughout your CV to improve ATS compatibility',
        example: 'Review target job postings and naturally include relevant terms like "project management," "agile methodology," "stakeholder engagement"',
      });
    }

    if (!criteria.hasStandardSections) {
      improvements.push({
        category: 'ATS Compatibility',
        priority: 'medium',
        issue: 'Non-standard section headers may confuse ATS systems',
        suggestion: 'Use standard section headers like "Work Experience," "Education," "Skills" instead of creative alternatives',
        example: 'Use "Work Experience" instead of "My Journey" or "Professional Background"',
      });
    }

    // Formatting Issues (Low Priority)
    if (!criteria.appropriateLength) {
      const wordCount = criteria.wordCount;
      if (wordCount < 300) {
        improvements.push({
          category: 'CV Length',
          priority: 'low',
          issue: 'CV is too short and may lack sufficient detail',
          suggestion: 'Expand your CV to 400-800 words by adding more details about your achievements, responsibilities, and skills',
          example: 'Elaborate on your key projects, quantify your achievements, and provide context for your accomplishments',
        });
      } else if (wordCount > 1200) {
        improvements.push({
          category: 'CV Length',
          priority: 'low',
          issue: 'CV is too long and may lose reader attention',
          suggestion: 'Condense your CV to 1-2 pages by focusing on most relevant and recent experiences',
          example: 'Remove outdated roles, consolidate similar responsibilities, and focus on achievements rather than duties',
        });
      }
    }

    if (!criteria.consistentFormatting) {
      improvements.push({
        category: 'Formatting',
        priority: 'low',
        issue: 'Inconsistent formatting throughout the document',
        suggestion: 'Use consistent bullet points, spacing, and formatting style throughout your CV for a professional appearance',
        example: 'Choose one bullet style (• or -) and use it consistently. Maintain uniform spacing between sections.',
      });
    }

    if (!criteria.properDateFormats) {
      improvements.push({
        category: 'Date Formatting',
        priority: 'low',
        issue: 'Missing or inconsistent date formats',
        suggestion: 'Include clear date ranges for all positions and education using a consistent format',
        example: 'Use format like "Jan 2020 - Present" or "2020 - 2023" consistently throughout',
      });
    }

    // Sort by priority and return top improvements
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    improvements.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return improvements.slice(0, 8); // Return top 8 improvements
  }

  /**
   * Get section completeness summary
   */
  private getSectionCompleteness(criteria: CVAnalysisCriteria): SectionCompleteness {
    return {
      contactInfo: criteria.hasContactInfo,
      summary: criteria.hasProfessionalSummary,
      experience: criteria.hasWorkExperience,
      education: criteria.hasEducation,
      skills: criteria.hasSkills,
    };
  }

  /**
   * Generate detailed feedback summary
   */
  private generateDetailedFeedback(
    score: number,
    strengths: string[],
    improvements: Improvement[]
  ): string {
    let feedback = '';

    if (score >= 85) {
      feedback = 'Excellent CV! Your CV demonstrates strong professional presentation with clear structure and compelling content.';
    } else if (score >= 70) {
      feedback = 'Good CV with solid foundation. With a few improvements, your CV can be even more competitive.';
    } else if (score >= 50) {
      feedback = 'Your CV has potential but needs improvement in several areas to stand out to employers and pass ATS systems.';
    } else {
      feedback = 'Your CV requires significant improvements to effectively showcase your qualifications and pass ATS screening.';
    }

    feedback += ` You have ${strengths.length} key strengths and ${improvements.length} areas for improvement.`;

    return feedback;
  }

  // ============================================================================
  // Detection Methods
  // ============================================================================

  /**
   * Detect contact information
   */
  private detectContactInfo(text: string): boolean {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    
    return emailPattern.test(text) || phonePattern.test(text);
  }

  /**
   * Detect specific section
   */
  private detectSection(text: string, section: keyof typeof this.SECTION_PATTERNS): boolean {
    const pattern = this.SECTION_PATTERNS[section];
    return pattern.test(text);
  }

  /**
   * Check if CV has standard sections
   */
  private hasStandardSections(text: string): boolean {
    const hasExperience = this.detectSection(text, 'experience');
    const hasEducation = this.detectSection(text, 'education');
    const hasSkills = this.detectSection(text, 'skills');
    
    return hasExperience && hasEducation && hasSkills;
  }

  /**
   * Count action verbs in text
   */
  private countActionVerbs(text: string): number {
    const lowerText = text.toLowerCase();
    let count = 0;

    for (const verb of this.ACTION_VERBS) {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        count += matches.length;
      }
    }

    return count;
  }

  /**
   * Count quantifiable achievements (numbers, percentages, metrics)
   */
  private countQuantifiableAchievements(text: string): number {
    const patterns = [
      /\b\d+%/g, // Percentages
      /\$\d+[kmb]?/gi, // Dollar amounts
      /\b\d+\+?\s*(years?|months?|weeks?)/gi, // Time periods
      /\b(increased|decreased|improved|reduced|grew|saved)\s+\w+\s+by\s+\d+/gi, // Achievement patterns
      /\b\d+\s*(users?|customers?|clients?|projects?|teams?)/gi, // Quantities
    ];

    let count = 0;
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }

    return count;
  }

  /**
   * Calculate keyword density
   */
  private calculateKeywordDensity(text: string): number {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) return 0;

    let keywordCount = 0;
    for (const keyword of this.PROFESSIONAL_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        keywordCount += matches.length;
      }
    }

    return (keywordCount / words.length) * 100;
  }

  /**
   * Check if CV has relevant keywords
   */
  private hasRelevantKeywords(text: string): boolean {
    const density = this.calculateKeywordDensity(text);
    return density >= 1.0; // At least 1% keyword density
  }

  /**
   * Calculate sentence complexity
   */
  private calculateSentenceComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;

    const totalWords = sentences.reduce((sum, sentence) => {
      return sum + sentence.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);

    return totalWords / sentences.length;
  }

  /**
   * Check for consistent formatting
   */
  private checkConsistentFormatting(lines: string[]): boolean {
    // Check for consistent bullet points or numbering
    const bulletLines = lines.filter(line => /^[\s]*[-•*]\s/.test(line));
    const numberLines = lines.filter(line => /^[\s]*\d+[.)]\s/.test(line));
    
    // If using bullets or numbers, should be consistent
    const totalFormatted = bulletLines.length + numberLines.length;
    
    // Consider consistent if at least some formatting is present
    return totalFormatted >= 3;
  }

  /**
   * Check if CV length is appropriate
   */
  private checkAppropriateLength(wordCount: number): boolean {
    // Ideal CV length: 400-800 words (1-2 pages)
    return wordCount >= 300 && wordCount <= 1200;
  }

  /**
   * Check for proper date formats
   */
  private checkDateFormats(text: string): boolean {
    for (const pattern of this.DATE_PATTERNS) {
      if (pattern.test(text)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Normalize text for analysis
   */
  private normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
