import { 
    auth, 
    googleProvider, 
    signInWithPopup, 
    signInWithRedirect,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,     
    sendPasswordResetEmail,         
    updatePassword,                 
    onAuthStateChanged,
    getRedirectResult 
} from './firebase-auth.js'; 

const wrapper = document.querySelector('.wrapper');
const loginLinks = document.querySelectorAll('.login-link'); 
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const forgotLink = document.querySelector('.forgot-link');
const changePasswordLink = document.querySelector('.change-password-link');

const loginFormDiv = document.getElementById('login-form');
const registerFormDiv = document.getElementById('register-form');
const forgotFormDiv = document.getElementById('forgot-form');
const changeFormDiv = document.getElementById('change-form'); 
const googleLoginButton = document.getElementById('btn-google-login');

const REDIRECT_PAGE = 'peliculas.html?id=cartelera';

const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
            console.log('Usuario autenticado con Google (redirect result):', result.user.email);
            alert('¡Inicio de sesión con Google exitoso!');
            window.location.href = REDIRECT_PAGE;
            return; 
        } else {
            console.log('No hay resultado de redirección pendiente');
        }
    } catch (error) {
        console.error("Error al manejar el resultado de redirección:", error);
        alert(`Error al iniciar sesión con Google: ${error.message}`);
    }
};

const checkAuthAndRedirect = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('Usuario ya autenticado:', user.email);
            const currentPage = window.location.pathname;
            if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
                console.log('Redirigiendo a página principal...');
                window.location.href = REDIRECT_PAGE;
            }
        } else {
            console.log('No hay usuario autenticado');
        }
    });
};

// Ejecutar ambas funciones al cargar la página
handleRedirectResult();
checkAuthAndRedirect();

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
    wrapper.classList.remove('active-forgot');
    wrapper.classList.remove('active-change'); 
});

loginLinks.forEach(link => {
    link.addEventListener('click', () => {
        wrapper.classList.remove('active');
        wrapper.classList.remove('active-forgot');
        wrapper.classList.remove('active-change');
        wrapper.classList.remove('active-direct-change');
    });
});

forgotLink.addEventListener('click', ()=> {
    wrapper.classList.add('active-forgot');
    wrapper.classList.remove('active');
    wrapper.classList.remove('active-change');
});

changePasswordLink.addEventListener('click', () => {
    wrapper.classList.add('active-direct-change');
    wrapper.classList.remove('active');
    wrapper.classList.remove('active-forgot');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
    wrapper.classList.remove('active');
    wrapper.classList.remove('active-forgot');
    wrapper.classList.remove('active-change');
    wrapper.classList.remove('active-direct-change');
});

if (loginFormDiv) {
    const loginForm = loginFormDiv.querySelector('form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputs = loginForm.querySelectorAll('input');
        const email = inputs[0].value; 
        const password = inputs[1].value; 

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login exitoso:', userCredential.user.email);
            alert('¡Inicio de sesión exitoso!');
            window.location.href = REDIRECT_PAGE; 
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            let errorMessage = 'Error al iniciar sesión';
            
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuario no encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Usuario deshabilitado';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        }
    });
}

if (googleLoginButton) {
    googleLoginButton.addEventListener('click', async () => {
        try {
            console.log('Iniciando proceso de login con Google...');
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            alert(`Error: ${error.message}`);
        }
    });
}

if (registerFormDiv) {
    const registerForm = registerFormDiv.querySelector('form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputs = registerForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        const username = inputs[0].value; 
        const email = inputs[1].value; 
        const password = inputs[2].value; 

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registro exitoso:', userCredential.user.email);
            alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            window.location.href = REDIRECT_PAGE;
        } catch (error) {
            console.error("Error al registrar:", error);
            let errorMessage = 'Error al registrar';
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'El email ya está en uso';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        }
    });
}

if (forgotFormDiv) {
    const forgotForm = forgotFormDiv.querySelector('form');
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = forgotForm.querySelector('input[type="email"]').value;

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.");
            wrapper.classList.remove('active-forgot'); 
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            alert(`Error al enviar el correo: ${error.message}`);
        }
    });
}

if (changeFormDiv) {
    const changeForm = changeFormDiv.querySelector('form');
    changeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputs = changeForm.querySelectorAll('input[type="password"]');
        const newPassword = inputs[0].value; 
        const confirmNewPassword = inputs[1].value; 
        const user = auth.currentUser;

        if (newPassword !== confirmNewPassword) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }
        
        if (!user) {
             alert("Debes iniciar sesión para cambiar la contraseña.");
             return;
        }

        try {
            await updatePassword(user, newPassword);
            alert("Contraseña cambiada exitosamente.");
            window.location.href = REDIRECT_PAGE;
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            alert(`Error al cambiar contraseña: ${error.message}. Por favor, vuelve a iniciar sesión y prueba de nuevo.`);
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuario autenticado:', user.email);
    } else {
        console.log('No hay usuario autenticado');
    }
});