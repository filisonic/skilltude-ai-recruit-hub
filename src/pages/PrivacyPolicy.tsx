import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-lg text-gray-700">Skilltude Talent Solutions LLP</p>
                <p className="text-sm text-gray-600 mt-2">Last Updated: October 24, 2025</p>
              </div>
            </div>
          </section>
          
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-6">
                  Skilltude Talent Solutions LLP ("Skilltude Talent Solutions LLP," "we," "us," or "our") is committed to protecting the privacy of all individuals who interact with our services across our three primary business verticals: Internal Employment, Staffing/Payroll, and Consultancy. This policy outlines how we collect, use, and share your Personal Data.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Scope and Applicability</h2>
                <p className="text-gray-700 mb-4">This policy applies to:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Recruitment Candidates:</strong> Individuals seeking permanent placement with our third-party clients.</li>
                  <li><strong>Staffing Employees:</strong> Individuals employed directly on Skilltude Talent Solutions LLP's payroll but deployed to client work sites.</li>
                  <li><strong>Internal Employees:</strong> Individuals employed by Skilltude Talent Solutions LLP for internal operations (e.g., internal recruiters, admin).</li>
                  <li><strong>Consultancy Clients:</strong> Individuals paying for career counselling, training, or skill development services.</li>
                </ol>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
                <p className="text-gray-700 mb-4">We collect various categories of data depending on the service you utilize:</p>
                
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Data Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Examples of Personal Data Collected</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Purpose of Processing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Identity & Contact</td>
                        <td className="border border-gray-300 px-4 py-3">Name, Address, Email, Phone Number, Date of Birth, Gender, Photographs.</td>
                        <td className="border border-gray-300 px-4 py-3">Communication, verification, statutory filings.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">Professional & Recruitment</td>
                        <td className="border border-gray-300 px-4 py-3">CV, Work History, Skills, Educational Background, Interview Notes, References, Salary Expectations.</td>
                        <td className="border border-gray-300 px-4 py-3">Matching candidates with job roles and clients.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Statutory & Financial (Staffing/Employment)</td>
                        <td className="border border-gray-300 px-4 py-3">Bank Account Details, Permanent Account Number (PAN), Aadhaar Number, Provident Fund (PF) details, Employees' State Insurance (ESI) details, Payroll records, Medical reports (where required by law).</td>
                        <td className="border border-gray-300 px-4 py-3">Mandatory for employment, payroll processing, statutory compliance, and benefits administration.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">Consultancy & Billing</td>
                        <td className="border border-gray-300 px-4 py-3">Service history, Billing address, Payment receipts, Career goals.</td>
                        <td className="border border-gray-300 px-4 py-3">Delivering and invoicing for paid training and consulting services.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Lawful Basis for Processing (DPDP Act, India)</h2>
                <p className="text-gray-700 mb-4">In compliance with the Digital Personal Data Protection Act, 2023 (India), our processing relies on the following grounds:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Consent:</strong> For sharing Candidate profiles with external clients for job applications (Recruitment).</li>
                  <li><strong>Contractual Necessity:</strong> For providing the requested services (Consultancy) or fulfilling the terms of your employment agreement (Staffing/Internal Employees).</li>
                  <li><strong>Legitimate Use:</strong> Processing that is necessary for employment purposes, including recruitment, attendance, payroll, benefits, and complying with all applicable labour laws and statutory obligations (PF, ESI, Taxes).</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Disclosure and Sharing of Your Personal Data</h2>
                <p className="text-gray-700 mb-4">We share your data only when necessary and relevant to the services provided:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Third-Party Clients (Recruitment):</strong> Candidate data (CV, Professional History) is shared with prospective hiring companies for placement and recruitment purposes, strictly with your consent.</li>
                  <li><strong>Client Work Sites (Staffing/Payroll Employees):</strong> For employees deployed on our payroll to client locations, necessary identification and professional data may be shared with the client company for project management, site access, and supervision purposes.</li>
                  <li><strong>Statutory and Regulatory Bodies:</strong> We share financial and employment-related data (PAN, PF, ESI, Tax details) with government authorities as mandated by Indian law.</li>
                  <li><strong>Service Providers:</strong> We may share data with third-party vendors who perform services on our behalf, such as payroll processors, auditors, and IT infrastructure providers. These parties are bound by strict confidentiality obligations.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your Personal Data only for as long as necessary to fulfill the purpose for which it was collected, to provide our services, or to comply with applicable legal and regulatory obligations, including those under the DPDP Act.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                  <li><strong>Non-Hired Candidate Data:</strong> We retain profiles and related recruitment data for a period of up to one (1) year following the last interaction. This period may be extended up to three (3) years if we receive your explicit consent to retain your data for future job opportunities.</li>
                  <li><strong>Employee/Statutory Data:</strong> Data related to employment, payroll, and statutory filings will be retained for the period mandated by Indian tax, labour, and corporate laws (typically 7-8 years).</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Security and Grievance Redressal</h2>
                <p className="text-gray-700 mb-4">
                  We employ technical and organizational security measures to protect your data. You have the right to access, correct, or request the deletion of your Personal Data.
                </p>
                <p className="text-gray-700 mb-4">
                  For any queries, concerns, or to exercise your data rights, please contact our Grievance Officer:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-700"><strong>Grievance Officer:</strong> Head of HR & Compliance</p>
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

export default PrivacyPolicy;
