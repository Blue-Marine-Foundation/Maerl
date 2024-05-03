'use client';

import { createClient } from '@/_utils/supabase/client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Project, Output } from '@/_lib/types';
import ControlledInput from '../updateform/Input';
import ControlledTextarea from '../updateform/Textarea';
import ModalSuccessMessage from './ModalSuccessMessage';
import { useRouter } from 'next/navigation';

export default function FundingRequestModal({
  project,
  output,
  userId,
}: {
  project: Project;
  output: Output;
  userId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function closeModal({
    afterSuccessfulUpdate,
  }: {
    afterSuccessfulUpdate?: boolean;
  } = {}) {
    setIsOpen(false);

    if (afterSuccessfulUpdate) router.refresh();
  }

  function openModal() {
    setIsOpen(true);
  }

  const initialState = {
    user: userId,
    project: project.id,
    output: output.id,
    date: new Date().toISOString().split('T')[0],
    currency: 'GBP',
    amount: '',
    detail: '',
  };

  const [inputValues, setInputValues] = useState(initialState);

  const handleInputChange = (name: string) => (newValue: string | number) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] =
    useState(false);

  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    const request = {
      date: inputValues.date,
      project_id: inputValues.project,
      output_id: inputValues.output,
      detail: inputValues.detail,
      currency: inputValues.currency,
      amount: inputValues.amount,
      requested_by: inputValues.user,
    };

    setTimeout(async () => {
      const { data, error } = await supabase
        .from('funding_requests')
        .insert(request)
        .select();

      if (error) {
        setIsSubmitting(false);
        setHasSubmittedSuccessfully(false);
        setFormError(true);
        setErrorMessage(
          `Error submitting update (please screenshot this error and send it to Appin): ${error.message}`
        );
        console.log('Tried to submit: ', request);
      }

      if (data) {
        console.log(data);
        setFormError(false);
        setErrorMessage('');
        setIsSubmitting(false);
        setHasSubmittedSuccessfully(true);
        setInputValues((prevValues) => ({
          ...prevValues,
          date: new Date().toISOString().split('T')[0],
          detail: '',
          currency: 'GBP',
          amount: '',
        }));
        setTimeout(() => {
          closeModal({ afterSuccessfulUpdate: true });
          setHasSubmittedSuccessfully(false);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <>
      <div className=''>
        <button
          type='button'
          onClick={openModal}
          className='px-4 py-1.5 rounded-md border bg-card-bg hover:bg-background/70 shadow-md transition-all'
        >
          Request funding
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => closeModal()}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/70' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-4xl transform overflow-hidden rounded-2xl bg-card-bg p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6'
                  >
                    New Funding Request: {project.name}
                  </Dialog.Title>
                  <form
                    className='mt-6 pb-2 flex flex-col gap-6'
                    id='newFundingRequest'
                    onSubmit={handleSubmit}
                  >
                    <div className='flex justify-between items-baseline gap-8'>
                      <p className='block basis-1/5 shrink-0 text-sm text-foreground/80'>
                        Output
                      </p>
                      <p className='grow'>
                        Output {output.code.slice(2, 6)}: {output.description}
                      </p>
                    </div>

                    <ControlledTextarea
                      label='Funding request detail'
                      placeholder='A short description of your funding request, for example, "Funding required to complete survey in June 2025"'
                      initialValue={inputValues.detail}
                      onChange={handleInputChange('detail')}
                      isRequired={true}
                    />

                    <ControlledInput
                      type='text'
                      initialValue={inputValues.currency}
                      label='Currency'
                      placeholder='GBP'
                      isRequired
                      onChange={handleInputChange('currency')}
                    />

                    <ControlledInput
                      type='number'
                      initialValue={inputValues.amount}
                      label='Amount required'
                      placeholder='1'
                      isRequired
                      onChange={handleInputChange('amount')}
                    />

                    <div className='flex justify-end items-start gap-8'>
                      {formError && (
                        <p className='pt-2 pl-2 max-w-md'>{errorMessage}</p>
                      )}
                      <button
                        type='submit'
                        className='px-4 py-2 w-40 text-center bg-btn-background hover:bg-btn-background-hover rounded-md transition-colors duration-500'
                      >
                        {isSubmitting ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='mx-auto animate-spin text-purple-200'
                          >
                            <line x1='12' x2='12' y1='2' y2='6' />
                            <line x1='12' x2='12' y1='18' y2='22' />
                            <line x1='4.93' x2='7.76' y1='4.93' y2='7.76' />
                            <line x1='16.24' x2='19.07' y1='16.24' y2='19.07' />
                            <line x1='2' x2='6' y1='12' y2='12' />
                            <line x1='18' x2='22' y1='12' y2='12' />
                            <line x1='4.93' x2='7.76' y1='19.07' y2='16.24' />
                            <line x1='16.24' x2='19.07' y1='7.76' y2='4.93' />
                          </svg>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>

                    <ModalSuccessMessage isVisible={hasSubmittedSuccessfully} />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
