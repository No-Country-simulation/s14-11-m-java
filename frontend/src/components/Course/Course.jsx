import arrowLeft from './svg/arrowLeft.svg'
import arrowRight from './svg/arrowRight.svg'
import { useLocation, useParams , useNavigate } from 'react-router-dom'
import svgDocument from './svg/svgDocument.svg'
// import axios from "axios";

import { modifyProgressById } from '../../redux/slices/course/courseSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react'


export default function Course() {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const informacionCurso = useSelector((state) => state.course.curso);

    const [infoContenido,setInfoContenido]=useState([])
    const [infoModulo,setInfoModulo] = useState([])

    const params = useParams();
    
    const location = useLocation()

    const urlSlice = location.pathname.slice(0,-1)
    // const urlContent = parseInt(location.pathname.split('/')[5])

    const ID_MODULO = params.moduloid
    const ID_CONTENIDO = params.contentid
    
    //ARMAR LA RUTA DEL CURSO
    const urlRoot=`/dashboard/curso/${informacionCurso.id}/`
    console.log(urlRoot)

    //GENERAR LA RUTA DE CADA MODULO Y DE CADA CONTENIDO (urlContent)
    let urlContent = [];
    function generarContents(origen) {
        let contents = 0
        origen.modules.forEach((modulo) => {
        //   ESTO ES POR SI SE AGREGA CONTENIDO EN EL TITULO DEL MODULO
        //   urlContent.push(`${modulo.id}`);
          modulo.contents.forEach((contenido) => {
            contents ++ 
            urlContent.push(`${modulo.id}/${contents}`);
          });
        });
        console.log(urlContent)
        return urlContent;
    }
    
    //FUNCION ENCONTRAR INDICE (indexContent)
    const findUrlContent = () => {
        const texto = location.pathname;
        const presentContent = texto.replace(urlRoot, '');
        const indexContent = urlContent.indexOf(presentContent);    
        return indexContent;
    }
    //FUNCION CONTENIDO ANTERIOR
    const urlAnterior = () => {
        let indexContent = findUrlContent()
        console.log('Ant indexContent:', indexContent);
        if (indexContent == 0) return
        indexContent --
        console.log('Ant indexContent:', indexContent);
        const url = urlRoot + urlContent[indexContent]
        navigate(url)
    }

    //FUNCION CONTENIDO SIGUIENTE
    const urlSiguiente = () => {
        let indexContent = findUrlContent()
        if ((indexContent +1) == indexContent.length) return
        indexContent ++
        const url = urlRoot + urlContent[indexContent]
        navigate(url)
    }
    

    useEffect(()=>{
        if(informacionCurso){
            const infoModulo = informacionCurso.modules?.filter( modulo => parseInt(modulo.id) === parseInt(ID_MODULO))
            setInfoModulo(infoModulo[0])
            const contentFiltered = infoModulo[0].contents.filter(contenido => parseInt(contenido.id) === parseInt(ID_CONTENIDO))
            setInfoContenido(contentFiltered[0])
        }
        //GENERA LA RUTA DE CONTENIDOS CUANDO SE ABRE POR PRIMERA VEZ
        generarContents(informacionCurso)
    })




    {/* PROGRESS */}

    const enviarDatos = async (idProgress) => {
        /* const URL_PROGRESS = 'https://s14-11-m-java.onrender.com/api/v1/progresses'
        const RUTA = `${URL_PROGRESS}/${idProgress}`
        const token = localStorage.getItem("jwt");

        const config = {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
          };

         await axios.patch(RUTA, idProgress, config)
            .then(response => {
              
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
            }); */

            dispatch(modifyProgressById({moduloId:ID_MODULO,contentId:ID_CONTENIDO}))
        };


    return (
        <>  
            <div className="w-full">
                <div className="w-full h-full mx-auto">
                    {/* VIDEO */}
                    <iframe className="w-full lg:h-96 md:h-56 h-52" src={infoContenido.urlVideo} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    
                    {/* BOTONES DE AVANZAR Y RETROCEDER */}
                    <div className='flex justify-around text-xl my-6'>
                        <buton className={"cursor-pointer"} onClick={() => enviarDatos(infoContenido.progress.id)}>Modificar progress</buton>
                        <div className='flex hover:text-blue-700 cursor-pointer' onClick={urlAnterior}>
                            <span className='flex'>
                                <img className='w-6' src={arrowLeft}/>
                                Anterior
                            </span>
                        </div>
                        <div className='flex hover:text-blue-700 cursor-pointer' onClick={urlSiguiente}>
                            <span className='flex'>
                                Siguiente
                                <img className='w-6' src={arrowRight}/>
                            </span>
                        </div>
                    </div>

                    <h1 className="text-[1.7rem] tracking-[0.7px] font-bold text-[#2d2f31]">{infoContenido.title}</h1>
                    <p className="text-[1.1rem] text-[#2d2f31] font-normal">{infoContenido.description}</p>
                    <a className='flex items-center my-10' href={infoContenido.urlPdf} target='_blank'>
                        <img className='w-10' src={svgDocument}/>
                        <label className='text-lg cursor-pointer hover:border-b-2 hover:border-b-gray-600'>Descargar contenido del curso</label>
                    </a>
                </div>
            </div>
        </>
    )
}