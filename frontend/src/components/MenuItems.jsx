import React from 'react';
import  './MenuItems.css';
import {
    Link
  } from "react-router-dom";

const MenuItems = ({onLogin}) => {
    return (
        <div  className='menuItemsContainer'>
            {/* <div className='menuItemLogo1'><Link to='/'><img className="decodeblockslogo" src="DecodeBlocks-bgBlack.png" alt='decodeblockslogo'/></Link></div> */}
            <div className='menuItemLogo'><Link to='/'><img className="rotate" src="ethicon.svg" alt='ethicon'/></Link></div>
            <ul className='menuItems'>
                <li className='menuItem'><Link to='/'>Home</Link></li>
                <li className='menuItem'><Link to='/SimpleStorageDapp'>Data Storage</Link></li>
                <li className='menuItem'><Link to='/BankDapp'>SAI Bank</Link></li>
                
                {/* <li className='menuItem'>Currency Exchange</li>
                <li className='menuItem'><Link to='/Test'>Test</Link></li> */}
                <li className='loginItem' onClick={async (e) => await onLogin(e)}>Login</li>
            </ul>
        </div>
    );
};

export default MenuItems;