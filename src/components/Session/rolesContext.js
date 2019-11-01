import React from 'react';
import * as ROLES from '../../constants/roles';

const RolesContext = React.createContext(ROLES.GUEST);

export default RolesContext;