import React from 'react'

export default function Notification({counts}) {
    return (
        <div style={{display:'flex'}}>
            <button type="button" className="icon-button">
                <span className="material-icons">notifications</span>
                {counts>0?<span className="icon-button__badge">{counts}</span>:<></>}
                
            </button>
        </div>
    )
}
