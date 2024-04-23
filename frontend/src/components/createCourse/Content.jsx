import { useEffect, useState } from "react";
import useCurso from "../../hooks/useCurso";
import SubirArchivo from '../SubirArchivo/SubirArchivo'

import leftArrow from '../../assets/svgs/left-row.svg'

import validarDatos from "../../utils/ValidarDatos";

import Alertas from "../Alertas/Alertas";

function Content() {
    const [open,setOpen]=useState(false)
    const [alerta,setAlerta]=useState({
        state:false,
        msg:''
    })

    const [titleContenido,setTitleContenido]=useState('')
    const [urlVideo,setUrlVideo]=useState('')
    const [descripcion,setDescripcion]=useState('')
    
    const [fileImagen,setFileImagen]=useState(null)
    const [urlImg,setUrlImg]=useState(null)

    const [idModulo,setIdModulo]=useState(null)
    const [tituloModulo,setTitleModulo]=useState('')
    const [contenido,setContenido]=useState([])

    const {
        stateModulos,
        dispatch
    }=useCurso()


    const handleCrearContenido =(e)=>{
        e.preventDefault()

        const dataVerify = {
            'title':titleContenido,
            'urlVideo':urlVideo,
            'description':descripcion,
        }

        const verify = validarDatos(dataVerify)

        if(!verify){
            setAlerta({
                state:true,
                msg:'los campos marcados con * son obligatorios'
            })
            setTimeout(() => {
                setAlerta({
                    state:false,
                    msg:''
                })
            }, 4000);
            return
        }

        const data={
            'position':(contenido.length + 1)-1,
            'title':titleContenido,
            'urlVideo':urlVideo,
            'urlPdf':urlImg,
            'description':descripcion,
        }

        dispatch({
            type:"agrega-contenido",
            payload:{ 
                moduloId:idModulo, 
                contents:data
            }
        })

        setContenido([...contenido,data])
        closeVentana()
    }

    const closeVentana =()=>{
        setOpen(false)
        setTitleContenido('')
        setDescripcion('')
        setUrlVideo('')
    }

    useEffect(()=>{
        const ruta = window.location.hash.substring(1).split('-')[1]
        setIdModulo(ruta)
    },[])

    useEffect(()=>{
        if(idModulo){
            const moduloIndex = stateModulos.modules.findIndex(modulo => parseInt(modulo.position )=== parseInt(idModulo));
            if (moduloIndex !== -1) {
                setTitleModulo(stateModulos.modules[moduloIndex].title)
                setContenido(stateModulos.modules[moduloIndex].contents)
            }
        }
    },[idModulo])

    const returnModulos =()=>{
        const urlSinHash = window.location.href.split('#')[0];
        window.location.href = `${urlSinHash}#modulo`
    }

    return (
        <>
            <div className="flex md:flex-row flex-col justify-between  mt-2 items-center">
                <button
                    onClick={returnModulos}
                    className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    <img src={leftArrow} alt="left-arrow"/>
                </button>
                <h1 className="text-xl font-bold">{`Modulo: ${tituloModulo}`}</h1>
                <button
                    onClick={()=>setOpen(true)}
                    className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    CREAR CONTENIDO
                </button>
            </div>

            {
                open && 
                <Alertas err={alerta} size={'md'}>
                    <div className="bg-white flex flex-col gap-1 border-2 px-5 py-3 rounded-lg shadow-md mt-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-xl font-bold italic flex flex-row">
                                <p>Titulo del contenido</p>
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                onChange={(e)=>setTitleContenido(e.target.value)}
                                value={titleContenido}
                                name="title" 
                                type="text" 
                                className="border-2 bg-slate-200 border-gray-500 rounded-xl shadow py-1 px-5 outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl font-bold italic flex flex-row">
                                <p>Descripción</p>
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                onChange={(e)=>setDescripcion(e.target.value)}
                                value={descripcion}
                                name="title" 
                                type="text" 
                                className="border-2 bg-slate-200 border-gray-500 rounded-xl shadow py-1 px-5 outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl font-bold italic flex flex-row">
                                <p>Enlace de video</p>
                                <span className="text-red-500 ml-2">*</span>
                            </label>
                            <input
                                onChange={(e)=>setUrlVideo(e.target.value)}
                                value={urlVideo}
                                name="title" 
                                type="text" 
                                className="border-2 bg-slate-200 border-gray-500 rounded-xl shadow py-1 px-5 outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <SubirArchivo
                                setUrlImg={setUrlImg}
                                callback={setFileImagen}
                                stateImage={fileImagen}
                                label={'Subir archivo'}
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleCrearContenido}
                                className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                CREAR
                            </button>
                            <button
                                onClick={()=>setOpen(false)}
                                className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </Alertas>
            }

            {
                contenido.length === 0 && <h1 className="text-2xl font-bold italic text-center">Agrega contenido</h1> 
            }

            {
                contenido.length !== 0 &&
                <div className="grid grid-cols-1 gap-3 mt-3 px-5 py-3 bg-slate-200 rounded-lg">
                    {
                        contenido?.map((item,index)=>(
                            <div
                                key={index}
                                className="border bg-white shadow rounded-md p-3 hover:shadow-lg cursor-pointer"
                            >
                                <p className="font-bold text-xl">{`Titulo: ${item.title}`}</p>
                                <p className="font-semibold text-lg">{`Descripción: ${item.description}`}</p>
                            </div>
                        ))
                    }
                </div>

            }
            

        </>

        
    )
}

export default Content;
