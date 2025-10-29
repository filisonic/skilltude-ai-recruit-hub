import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                <p className="text-lg text-gray-700">Skilltude Talent Solutions LLP</p>
                <p className="text-sm text-gray-600 mt-2">Last Updated: October 24, 2025</p>
              </div>
            </div>
          </section>
          
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  These Terms of Service ("Terms") govern the relationship between you and Skilltude Talent Solutions LLP (referred to as "Skilltude Talent Solutions LLP," "we," "us," or "our") concerning all services offered, including recruitment, staffing, and human resource consulting.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Scope of Services</h2>
                <p className="text-gray-700 mb-6">
                  Skilltude Talent Solutions LLP is registered to carry on the business of providing human resource consultancy, staffing, recruiting, training, development, manpower supply, labour law compliance, skill and competency development, job placements, manpower planning, payroll management, productivity analysis, career counseling, and human resource management services.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Service Categories and Fees</h2>
                <p className="text-gray-700 mb-4">Our services are provided under three distinct categories, with separate fee structures:</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">2.1. Contingent Recruitment and Job Placement (Free to Candidate)</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Service:</strong> Introducing candidates to third-party client companies for direct, permanent employment.</li>
                  <li><strong>Fee Structure:</strong> Skilltude Talent Solutions LLP's fee is paid solely by the Client Employer.</li>
                  <li><strong>Candidate Obligation:</strong> Candidates are NOT required to pay any fee, deposit, or charge for placement services.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2.2. Staffing and Manpower Supply (Deployed Employee)</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Service:</strong> Employing individuals directly on the Skilltude Talent Solutions LLP payroll and deploying them to work at a Client's site under a service contract.</li>
                  <li><strong>Employment Relationship:</strong> The individual is an Employee of Skilltude Talent Solutions LLP for all payroll, statutory, and HR compliance purposes.</li>
                  <li><strong>Fee Structure:</strong> The fee for this service is paid by the Client Company to Skilltude Talent Solutions LLP. The deployed employee pays no fee.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2.3. Career and Skill Consultancy Services (Paid Service)</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Service:</strong> Providing dedicated, one-on-one consulting, training, development, career counseling, and skill enhancement programs (e.g., resume drafting, interview coaching).</li>
                  <li><strong>Fee Structure:</strong> For these services, the individual client ("Consultancy Client") agrees to pay a specific fee as outlined in a separate Service Agreement. The fee is charged ONLY for the delivery of the training/consulting service.</li>
                  <li><strong>No Guarantee:</strong> Payment for Consultancy Services DOES NOT guarantee or ensure job placement or employment through our recruitment or staffing channels.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. General Terms</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Representations:</strong> You warrant that all information (including CVs, certificates, and identity proofs) provided to Skilltude Talent Solutions LLP is true, accurate, and complete.</li>
                  <li><strong>Breach of Trust:</strong> Any attempt by a candidate to bypass Skilltude Talent Solutions LLP and contact a client introduced by us, or vice-versa, constitutes a breach of these Terms.</li>
                  <li><strong>Statutory Compliance:</strong> Skilltude Talent Solutions LLP will comply with all relevant Indian labour and tax laws for all its internal and deployed employees.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Indemnification</h2>
                <p className="text-gray-700 mb-6">
                  You agree to indemnify, defend, and hold harmless Skilltude Talent Solutions LLP, its directors, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney's fees) arising out of or in any way connected with your access to or use of the services, your breach of these Terms, or your violation of any applicable law or the rights of a third party.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Governing Law and Jurisdiction</h2>
                <p className="text-gray-700 mb-6">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, India.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">6. Contact Information</h2>
                <p className="text-gray-700 mb-4">For any legal or service inquiries, please contact:</p>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-700 font-semibold mb-2">Skilltude Talent Solutions LLP</p>
                  <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:hr@skilltude.com" className="text-teal-600 hover:text-teal-700">hr@skilltude.com</a></p>
                  <p className="text-gray-700"><strong>Address:</strong> HD-193, WeWork, Embassy TechVillage, Bellandur, Bengaluru, Karnataka 560103, India</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default TermsOfService;
