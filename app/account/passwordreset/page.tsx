import FormMessages from '@/components/FormMessages';

export default function PasswordReset() {
  return (
    <>
      <div className='w-full px-8 py-16 bg-card-bg rounded-md shadow mb-16'>
        <form
          className='max-w-sm mx-auto flex-1 flex flex-col w-full justify-center gap-2 text-foreground '
          action='/auth/passwordreset'
          method='post'
        >
          <label className='text-md' htmlFor='new_password'>
            Enter a new password:
          </label>
          <input
            className='rounded-md px-4 py-2 bg-inherit border mb-6'
            type='password'
            name='new_password'
            id='new_password'
            placeholder=''
            autoComplete=''
            required
          />

          <FormMessages />

          <button className='bg-btn-background hover:bg-btn-background-hover text-white rounded-md px-4 py-2 text-foreground mb-2'>
            Request password reset
          </button>
        </form>
      </div>
    </>
  );
}
