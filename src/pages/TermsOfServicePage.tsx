import React from 'react';
import './TermsOfServicePage.css';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="terms-of-service-container">
      <h1 className="terms-of-service-title">Terms of Service</h1>
      <section>
        <h2>Introduction</h2>
        <p>
          Welcome to NexBuy! These Terms of Service ("Terms") govern your use of our website,
          products, and services (collectively, the "Services"). By accessing or using our Services,
          you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these
          Terms, please do not use our Services.
        </p>
      </section>

      <section>
        <h2>Account Registration</h2>
        <p>
          To access certain features of our Services, you may be required to register for an account.
          You agree to provide accurate, current, and complete information during the registration
          process and to update such information to keep it accurate, current, and complete.
          You are responsible for safeguarding your password and for all activities that occur
          under your account. You agree to notify NexBuy immediately of any unauthorized use of your
          account.
        </p>
      </section>

      <section>
        <h2>Use of Services</h2>
        <p>
          You agree to use our Services only for lawful purposes and in accordance with these Terms.
          You agree not to:
        </p>
        <ul>
          <li>Violate any applicable federal, state, local, or international law or regulation.</li>
          <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services.</li>
          <li>Use the Services in any manner that could disable, overburden, damage, or impair the site.</li>
          <li>Use any robot, spider, or other automatic device, process, or means to access the Services.</li>
          <li>Introduce any viruses, Trojan horses, worms, or other material that is malicious or technologically harmful.</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual Property Rights</h2>
        <p>
          The Services and their entire contents, features, and functionality (including but not
          limited to all information, software, text, displays, images, video, and audio, and the
          design, selection, and arrangement thereof) are owned by NexBuy, its licensors, or other
          providers of such material and are protected by copyright, trademark, patent, trade secret,
          and other intellectual property or proprietary rights laws.
        </p>
      </section>

      <section>
        <h2>Disclaimer of Warranties</h2>
        <p>
          YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES ARE PROVIDED ON AN "AS IS"
          AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          NEITHER NEXBUY NOR ANY PERSON ASSOCIATED WITH NEXBUY MAKES ANY WARRANTY OR REPRESENTATION
          WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY
          OF THE SERVICES.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          IN NO EVENT WILL NEXBUY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES,
          AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY,
          ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, ANY
          WEBSITES LINKED TO IT, ANY CONTENT ON THE SERVICES, OR SUCH OTHER WEBSITES, INCLUDING ANY
          DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </p>
      </section>

      <section>
        <h2>Governing Law and Jurisdiction</h2>
        <p>
          All matters relating to the Services and these Terms, and any dispute or claim arising
          therefrom or related thereto, shall be governed by and construed in accordance with the
          internal laws of the State/Province of [Your State/Province], without giving effect to any
          choice or conflict of law provision or rule.
        </p>
      </section>

      <section>
        <h2>Changes to Terms of Service</h2>
        <p>
          We may revise and update these Terms from time to time in our sole discretion. All changes
          are effective immediately when we post them and apply to all access to and use of the
          Services thereafter. Your continued use of the Services following the posting of revised
          Terms means that you accept and agree to the changes.
        </p>
      </section>

      <section>
        <h2>Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at
          <a href="mailto:support@nexbuy.com">support@nexbuy.com</a>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
