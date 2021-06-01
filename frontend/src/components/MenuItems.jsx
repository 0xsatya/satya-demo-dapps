import React from 'react';
import  './MenuItems.css';
import {
    Link
  } from "react-router-dom";

const MenuItems = ({onLogin}) => {
    return (
        <div  className='menuItemsContainer'>
            <ul className='menuItems'>
                <li className='menuItem'><Link to='/'>Home</Link></li>
                <li className='menuItem'><Link to='/SimpleStorageDapp'>SimpleStorage Contract</Link></li>
                <li className='menuItem'><Link to='/BankDapp'>Bank Dapp</Link></li>
                
                {/* <li className='menuItem'>Currency Exchange</li>
                <li className='menuItem'><Link to='/Test'>Test</Link></li> */}
                <li className='loginItem' onClick={async (e) => await onLogin(e)}>Login</li>
            </ul>
        </div>
    );
};

export default MenuItems;