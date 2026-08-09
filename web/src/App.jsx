import React from 'react';
import Navbar from './components/custom-components/Navbar';
import { LoginForm } from './components/custom-components/LoginForm';
import { SignupForm } from './components/custom-components/SignupForm';

function App() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main >
                {/* <div className="flex min-h-[80vh] w-full items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <LoginForm /> 
                        
                    </div>
                </div> */}
                <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <SignupForm />
                    </div>
                </div>


            </main>
        </div>
    );
}

export default App;