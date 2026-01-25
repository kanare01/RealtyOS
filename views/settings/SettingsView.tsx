import React from 'react';

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <div className="bg-gray-50 p-6 space-y-4">
      {children}
    </div>
  </div>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
    <label className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">{label}</label>
    {children}
  </div>
);

const SettingsView: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-8 max-w-4xl mx-auto">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Settings</h2>
        <p className="text-gray-500">Manage your account and application preferences.</p>
      </div>
      
      <SettingsSection title="Profile" description="Update your personal information.">
        <FormRow label="Full Name">
          <input type="text" defaultValue="John Doe" className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64" />
        </FormRow>
        <FormRow label="Email Address">
          <input type="email" defaultValue="john.doe@realtyos.com" className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64" />
        </FormRow>
        <div className="flex justify-end pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Save Changes</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Choose how you want to be notified.">
         <FormRow label="Email Notifications">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </FormRow>
         <FormRow label="SMS Notifications">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </FormRow>
      </SettingsSection>

      <SettingsSection title="Security" description="Manage your password and security settings.">
         <FormRow label="Change Password">
           <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-md text-sm transition-colors border border-gray-300">Change Password</button>
        </FormRow>
        <FormRow label="Two-Factor Authentication">
           <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-md text-sm transition-colors border border-gray-300">Enable 2FA</button>
        </FormRow>
      </SettingsSection>
    </div>
  );
};

export default SettingsView;