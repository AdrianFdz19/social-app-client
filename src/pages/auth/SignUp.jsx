import React, { useState } from 'react';
import '../styles/signup.scss';
import icons from '../../assets/icons';
import { useAppContext } from '../../context/AppContext';

export default function SignUp() {
    const {serverUrl} = useAppContext();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repeatPW: ""
    });
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

    /* 
        RECOMENDACIONES DE SEGURIDAD
        1.- Validar los datos en el servidor para protegerse contra entradas maliciosas
        2.- Proteccion contra CSRF:
            Utiliza tokens CSRF para proteger el formulario,
        3.- Asegurate de que la aplicacion web utilice HTTPS para cifrar los datos de transito entre el cliente y el servidor.
        4.- Uso de Content Security Policy (CSP):
            Implementa una politica de seguridad de contenido (CSP) para mitigar el riesgo de ataques XSS (cross-site scripting)
        5.- Escape y sanitizacion de datos
            Siempre escapa y sanitiza los datos antes de mostrarlos en la interfaz de usuario para prevenit ataques XSS
        6.- Manejo seguro de contrasenas
            Asegurate de no almacenar contrasenas en texto plano en el cliente. las contrasenas deben ser cifradas en el servidor y almacenadas de manera segura
    */

    const handleSubmitSignUp = async(e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await fetch(`${serverUrl}/auth/sign-up`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if(response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                console.error('server internal error');
            }
        } catch(err) {  
            console.error(err);
        }
    };

    return (
        <div className="sign-up-cont">
            <div className="sg-up-box">
                <form 
                    onSubmit={handleSubmitSignUp}
                >
                    <h3>Sign Up</h3>
                    <div className="question">
                        <p>Already have an account?</p>
                        <label>Sign In</label>
                    </div>
                    <input type="text" placeholder='Username'
                        value={formData.username}
                        onChange={(e)=>setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <input type="email" placeholder='Email'
                        value={formData.email}
                        onChange={(e)=>setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <div className="pw-box">
                        <input
                            type={isPasswordHidden.password ? 'password' : 'text'}
                            placeholder='Password'
                            value={formData.password}
                            onChange={(e)=>setFormData({...formData, password: e.target.value})}
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
                    <div className="pw-box">
                        <input
                            type={isPasswordHidden.repeatedPW ? 'password' : 'text'}
                            placeholder='Repeat password'
                            value={formData.repeatPW}
                            onChange={(e)=>setFormData({...formData, repeatPW: e.target.value})}
                            required
                        />
                        <button
                            type="button"
                            className='icon'
                            onClick={() => togglePasswordVisibility('repeatedPW')}
                        >
                            {isPasswordHidden.repeatedPW ? <icons.show className='icon' /> : <icons.hide className='icon' />}
                        </button>
                    </div>
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        </div>
    );
}
