import React from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy</h1>
      <section>
        <h2>Introduction</h2>
        <p>
          Welcome to NexBuy's Privacy Policy. We are committed to protecting your personal information
          and your right to privacy. If you have any questions or concerns about our policy,
          or our practices with regard to your personal information, please contact us at
          <a href="mailto:support@nexbuy.com">support@nexbuy.com</a>.
        </p>
      </section>

      <section>
        <h2>What Information Do We Collect?</h2>
        <h3>Personal information you disclose to us</h3>
        <p>
          We collect personal information that you voluntarily provide to us when you register on the
          Website, express an interest in obtaining information about us or our products and services,
          when you participate in activities on the Website (such as by posting messages in our forums
          or entering competitions) or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us
          and the Website, the choices you make and the products and features you use. The personal
          information we collect can include the following:
        </p>
        <ul>
          <li>Names</li>
          <li>Phone numbers</li>
          <li>Email addresses</li>
          <li>Mailing addresses</li>
          <li>Usernames</li>
          <li>Passwords</li>
          <li>Contact preferences</li>
          <li>Billing addresses</li>
          <li>Debit/credit card numbers</li>
        </ul>
      </section>

      <section>
        <h2>How Do We Use Your Information?</h2>
        <p>
          We use personal information collected via our Website for a variety of business purposes
          described below. We process your personal information for these purposes in reliance on
          our legitimate business interests, in order to enter into or perform a contract with you,
          with your consent, and/or for compliance with our legal obligations. We indicate the
          specific processing grounds we rely on next to each purpose listed below.
        </p>
        <ul>
          <li>To facilitate account creation and logon process.</li>
          <li>To post testimonials with your consent.</li>
          <li>To enable user-to-user communications with user's consent.</li>
          <li>To manage user accounts.</li>
          <li>To send administrative information to you.</li>
          <li>To protect our Services.</li>
          <li>To fulfill and manage your orders.</li>
          <li>To respond to user inquiries/offer support to users.</li>
          <li>To deliver targeted advertising to you.</li>
          <li>To administer prize draws and competitions.</li>
          <li>To request feedback.</li>
          <li>To protect our business interests and legal rights.</li>
        </ul>
      </section>

      <section>
        <h2>Will Your Information Be Shared With Anyone?</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with
          services, to protect your rights, or to fulfill business obligations.
        </p>
      </section>

      <section>
        <h2>How Long Do We Keep Your Information?</h2>
        <p>
          We keep your information for as long as necessary to fulfill the purposes outlined in this
          privacy policy unless otherwise required by law.
        </p>
      </section>

      <section>
        <h2>How Do We Keep Your Information Safe?</h2>
        <p>
          We aim to protect your personal information through a system of organizational and
          technical security measures.
        </p>
      </section>

      <section>
        <h2>What Are Your Privacy Rights?</h2>
        <p>
          In some regions (like the European Economic Area), you have rights that allow you greater
          access to and control over your personal information. You may review, change, or terminate
          your account at any time.
        </p>
      </section>

      <section>
        <h2>Do We Make Updates To This Policy?</h2>
        <p>
          Yes, we will update this policy as necessary to stay compliant with relevant laws.
        </p>
      </section>

      <section>
        <h2>How Can You Contact Us About This Policy?</h2>
        <p>
          If you have questions or comments about this policy, you may email us at
          <a href="mailto:support@nexbuy.com">support@nexbuy.com</a> or by post to:
        </p>
        <p>
          NexBuy Legal Department<br />
          123 NexBuy Street, Suite 100<br />
          City, State, 12345
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
