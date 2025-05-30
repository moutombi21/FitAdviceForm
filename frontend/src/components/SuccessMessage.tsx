import { CheckCircle2 } from 'lucide-react';

const SuccessMessage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-600 text-white">
          <h2 className="text-xl font-semibold">Registration Submitted Successfully</h2>
        </div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your sports coach registration has been submitted successfully. We will review your information and contact you shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your email address. Please check your inbox and follow any additional instructions if required.
            </p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Submit Another Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;