import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { countries } from '../data/counstries';
import { formTexts } from '../constants/formTexts';


interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string; 
  identityDocument: FileList;
  
  // Address Information
  address: string;
  city: string;
  zipCode: string; 
  country: string;
  residencyProof: FileList;
  
  // Professional Information
  qualifications: FileList;
  businessPermit: FileList;
  liabilityInsurance: FileList;
  taxNumber: string;
  vatNumber: string;
  bankDetails: string;
  companyStatutes: FileList;
  
  // Pricing Information
  hourlyRate: number;
  halfHourRate: number;
}

interface FormContainerProps {
  setIsSubmitted: (value: boolean) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ setIsSubmitted }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const onSubmitStep1 = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data } as FormData));
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const onSubmitStep2 = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data } as FormData));
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const onSubmitStep3 = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data } as FormData));
    setCurrentStep(4);
    window.scrollTo(0, 0);
  };

  const onSubmitFinal = async () => {
    try {
      setLoading(true);

      // Création d'un objet FormData pour gérer les fichiers
      const finalData = new FormData();

      console.log('FormData to submit:', formData);

      // champs de texte
      if (formData) {
        for (const key in formData) {
          const value = (formData as any)[key];

          if (value instanceof FileList) {
            for (let i = 0; i < value.length; i++) {
              finalData.append(key, value[i]);
            }
          } else if (typeof value === 'number') {
            finalData.append(key, value.toString()); // en string
          } else if (typeof value === 'string') {
            finalData.append(key, value);
          }
        }
      }

      const response = await fetch('http://localhost:5001/api/submit-form', {
        method: 'POST',
        body: finalData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      const result = await response.json();
      toast.success(result.message || 'Form submitted successfully!');
      reset();
      setIsSubmitted(true);

    } catch (error) {
      let errorMessage = 'Failed to submit form. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error submitting form:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

// Helper pour typer les erreurs API



  const goBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600 text-white">
          <h2 className="text-xl font-semibold">Sports Coach Registration</h2>
          <p className="text-indigo-100">Please complete all required information</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>2</div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>3</div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 4 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>4</div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {formTexts.steps.map((step, index) => (
              <span key={index}>{step}</span>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(onSubmitStep1)}>
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      {formTexts.labels.firstName} *  
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('firstName', { required: formTexts.errors.firstName })}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      {formTexts.labels.lastName} *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('lastName', { required: formTexts.errors.lastName })}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {formTexts.labels.email}*
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('email', { 
                        required: formTexts.errors.emailRequired,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: formTexts.errors.emailInvalid
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {formTexts.labels.phone}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('phone', { 
                          required: formTexts.errors.phoneRequired,
                          validate: {
                            minLength: (value) => 
                              value.replace(/\D/g, '').length >= 5 || formTexts.errors.phoneMin,
                            maxLength: (value) => 
                              value.replace(/\D/g, '').length <= 20 || formTexts.errors.phoneMax,
                            validChars: (value) =>
                              /^[\d\s+-]+$/.test(value) || formTexts.errors.phoneInvalid
                          }
                        })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="identityDocument" className="block text-sm font-medium text-gray-700 mb-1">
                    {formTexts.labels.identityDocument}*
                  </label>
                  <input
                    id="identityDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                    {...register('identityDocument', { required: formTexts.errors.identityDocRequired })}
                  />
                  {errors.identityDocument && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.identityDocument.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  {formTexts.boutton.Continue}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          )}
          
          {currentStep === 2 && (
            <form onSubmit={handleSubmit(onSubmitStep2)}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {formTexts.labels.Address}
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                    {...register('address', { required: "Adress is required" })}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.address.message}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      id="city"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('city', { required: "City is required" })}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <input
                      id="zipCode"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.zipCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('zipCode', { required: "ZIP Code is required" })}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    id="country"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.country ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                    {...register('country', { required: 'Country is required' })}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="residencyProof" className="block text-sm font-medium text-gray-700 mb-1">
                    Proof of Residency *
                  </label>
                  <input
                    id="residencyProof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                    {...register('residencyProof', { required: "Proof of Residency" })}
                  />
                  {errors.residencyProof && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.residencyProof.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          )}
          
          {currentStep === 3 && (
            <form onSubmit={handleSubmit(onSubmitStep3)}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                    Qualifications/Certifications *
                  </label>
                  <input
                    id="qualifications"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                    {...register('qualifications', { required: "Qualifications/Certifications" })}
                  />
                  {errors.qualifications && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.qualifications.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessPermit" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Permit
                  </label>
                  <input
                    id="businessPermit"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                    {...register('businessPermit')}
                  />
                </div>

                <div>
                  <label htmlFor="liabilityInsurance" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Liability Insurance *
                  </label>
                  <input
                    id="liabilityInsurance"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                    {...register('liabilityInsurance', { required: "Professional Liability Insurance" })}
                  />
                  {errors.liabilityInsurance && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.liabilityInsurance.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-1">Tax Number (NIF) *</label>
                    <input
                      id="taxNumber"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.taxNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                      {...register('taxNumber', { required: 'Tax number is required' })}
                    />
                    {errors.taxNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.taxNumber.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                    <input
                      id="vatNumber"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                      {...register('vatNumber')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700 mb-1">Bank Details (IBAN) *</label>
                  <input
                    id="bankDetails"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.bankDetails ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                    {...register('bankDetails', { required: 'Bank details are required' })}
                  />
                  {errors.bankDetails && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.bankDetails.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyStatutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Statutes (if applicable)
                  </label>
                  <input
                    id="companyStatutes"
                    type="file"
                    accept=".pdf"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-200"
                    {...register('companyStatutes')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (excl. VAT) *</label>
                    <div className="relative">
                      <input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.hourlyRate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                        {...register('hourlyRate', { 
                          required: 'Hourly rate is required',
                          min: { value: 0, message: 'Rate must be positive' }
                        })}
                      />
                      <span className="absolute right-3 top-2 text-gray-500">€</span>
                    </div>
                    {errors.hourlyRate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.hourlyRate.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="halfHourRate" className="block text-sm font-medium text-gray-700 mb-1">Half-Hour Rate (excl. VAT) *</label>
                    <div className="relative">
                      <input
                        id="halfHourRate"
                        type="number"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.halfHourRate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'}`}
                        {...register('halfHourRate', { 
                          required: 'Half-hour rate is required',
                          min: { value: 0, message: 'Rate must be positive' }
                        })}
                      />
                      <span className="absolute right-3 top-2 text-gray-500">€</span>
                    </div>
                    {errors.halfHourRate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.halfHourRate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          )}
          
          {currentStep === 4 && formData && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Information</h3>
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-800 mb-2">Please review your information before submitting. Once submitted, you won't be able to make changes.</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">First Name</p>
                        <p className="font-medium">{formData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Name</p>
                        <p className="font-medium">{formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">{formData.phone.toString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Address Information</h4>
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-medium">{formData.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">City</p>
                        <p className="font-medium">{formData.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ZIP Code</p>
                        <p className="font-medium">{formData.zipCode.toString()}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Country</p>
                        <p className="font-medium">{formData.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Professional Information</h4>
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Tax Number (NIF)</p>
                        <p className="font-medium">{formData.taxNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">VAT Number</p>
                        <p className="font-medium">{formData.vatNumber || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Bank Details (IBAN)</p>
                        <p className="font-medium">{formData.bankDetails}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hourly Rate (excl. VAT)</p>
                        <p className="font-medium">{formData.hourlyRate}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Half-Hour Rate (excl. VAT)</p>
                        <p className="font-medium">{formData.halfHourRate}€</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Uploaded Documents</h4>
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Identity Document
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Proof of Residency
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Qualifications/Certifications
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Professional Liability Insurance
                      </li>
                      {formData.businessPermit && (
                        <li className="flex items-center text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          Business Permit
                        </li>
                      )}
                      {formData.companyStatutes && (
                        <li className="flex items-center text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          Company Statutes
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={onSubmitFinal}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;