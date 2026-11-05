var formulario_contacto = document.getElementById('formulario_contacto');

formulario_contacto.addEventListener('submit', function(e){
    e.preventDefault();
    var datos = new FormData(formulario_contacto);
    
    fetch('../config/mensajeria/contact.php',{
        method:'POST',
        body: datos
    })
    .then( res => res.json())
    .then( data => { 
        if( data === 'error'){
            iziToast.error({
                title: 'Error',
                message: 'Porfavor debe marcar las opciones necesarias',
                position: 'center',
            });

        }else{
            if( data === 'error2'){
                iziToast.error({
                    title: 'Error',
                    message: 'Al parecer usted no esta en el Padron',
                    position: 'center',
                });
            }else{
                if( data === 'error3'){
                    iziToast.error({
                        title: 'Error',
                        message: 'Al parecer su voto no fue registrado',
                        position: 'center',
                    });
                }else{ 
                    if( data === 'error4'){
                        iziToast.error({
                            title: 'Error',
                            message: 'Al parecer por algun motivo hay algun error',
                            position: 'center',
                        });
                    }else{
                            if( data === 'voto'){
                                
                                iziToast.success({
                                    title: 'OK',
                                    message: 'Correcto, muchas gracias por contáctarnos',
                                    position: 'center',
                                });
                                setTimeout(function(){
                                    window.location.href='../';
                                },4000);
                            
                            }
                        }
                    }
                }
                            
            }
        
    })
});