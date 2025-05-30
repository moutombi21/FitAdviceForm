import { FormInput } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <FormInput className="h-8 w-8 text-indigo-600 mr-2" />
        <h1 className="text-xl font-bold text-blackRaisin-800">FitAdvice Form Submission Portal</h1>
      </div>
    </header>
  );
};

export default Header;