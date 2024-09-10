import React, { useEffect, useState } from 'react';
import '../styles/signup.scss';
import icons from '../../assets/icons';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const redirect = useNavigate();
    const { serverUrl } = useAppContext();
    const [isSubmitActive, setSubmitStatus] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);
    const [isPasswordHidden, setIsPasswordHidden] = useState({
        password: true,
        repeatedPW: true
    });

    const togglePasswordVisibility = (field) => {
        setIsPasswordHidden(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    useEffect(() => {
        const { username, password } = formData;
        setSubmitStatus(username && password);
    }, [formData]);

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        setErrorMsg([]);

        try {
            setLoading(true);
            const response = await fetch(`${serverUrl}/auth/sign-in`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                // Maneja la redirección o el siguiente paso después del registro exitoso
            } else {
                const isArray = data.isArray;
                if(isArray) {
                    const errors = data.errors;
                    const msgs = errors.map(err => err.msg);
                    setErrorMsg(msgs);
                } else {
                    const msg = data.msg;
                    setErrorMsg([msg]);
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(["An error occurred while processing your request"]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sign-up-cont">
            <div className="sg-up-box">
                <form onSubmit={handleSubmitSignUp}>
                    <h3>Sign In</h3>
                    <div className="question">
                        <p>Dont have an account?</p>
                        <label onClick={()=>redirect(`/sign-up`)} >Sign Up</label>
                    </div>
                    <input 
                        type="text" 
                        placeholder='Email or username'
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <div className="pw-box">
                        <input
                            type={isPasswordHidden.password ? 'password' : 'text'}
                            placeholder='Password'
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className='icon'
                            onClick={() => togglePasswordVisibility('password')}
                        >
                            {isPasswordHidden.password ? <icons.show className='icon' /> : <icons.hide className='icon' />}
                        </button>
                    </div>

                    {errorMsg.length > 0 && (
                        <div className="err-msg-box">
                            {errorMsg.map((msg, i) => (
                                <p key={i} className='error-msg'>{msg}</p>
                            ))}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        id='submit'
                        disabled={!isSubmitActive || loading}
                    >
                        {loading ? 'Submitting...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
