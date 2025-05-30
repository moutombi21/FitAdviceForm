import { useState } from 'react';
import FormContainer from './components/FormContainer';
import SuccessMessage from './components/SuccessMessage';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <main className="container mx-auto px-4 py-10">
        {isSubmitted ? (
          <SuccessMessage />
        ) : (
          <FormContainer setIsSubmitted={setIsSubmitted} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;