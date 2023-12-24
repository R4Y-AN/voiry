import React from 'react';
const MessageContainer=(props)=>{
        return (
            <div className={'w-full h-full '+(props.position==="right"&&" flex flex-col items-end")}>
                <div className='flex flex-row space-x-2'>
                    {props.position==="left"&&<img src={props.dp} className='w-[40px] h-[40px] rounded-full' alt="" />}
                    <div className='flex flex-col items-end'>
                        <h1 className='w-full  rounded-full px-4 py-2 bg-[#F1F1F3]'>{props.message}</h1>
                    </div>
                    {props.position==="right"&&<img src={props.dp} className='w-[40px] h-[40px] rounded-full' alt="" />}
                </div>
            </div>
        )  
}
export default MessageContainer;