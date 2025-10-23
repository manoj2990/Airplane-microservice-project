

const {UserRepository ,RoleRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const {Auth} = require('../utils/common');
const {Enums} = require('../utils/common');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data){
   
    try {
     
        const user = await userRepository.create(data);
        
        const role = await roleRepository.getRoleByName(Enums.USER_ROLE.CUSTOMER);
      
        await user.addRole(role);
     
     
        return user;
    } catch (error) {
      
        if( error instanceof AppError){
            throw error;
        }
        
        if(error.name === 'SequelizeUniqueConstraintError' 
        || error.name ===  'sequelizeUniqueConstraintError'
        || error.name === 'SequelizeDatabaseError'){
           let explanation = [];
           error.errors.forEach((err) => {
               explanation.push(err.message);
           });
           throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }

        

        throw new AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR);
    }

}



async function signIn(data) {
    try {
        const {email,password} = data;
    
        const user = await userRepository.getByEmail(email);
    
        if(!user){
            throw new AppError('No user found for the given email',StatusCodes.BAD_REQUEST);
        }
        
        const isPasswordValid = Auth.comparePassword({password,hashedPassword:user.password});
    
        if(!isPasswordValid){
            throw new AppError('Invalid email password',StatusCodes.BAD_REQUEST);
        }

        const jwt_token = Auth.createToken({id:user.id,email:user.email});
    
        return jwt_token;

    } catch (error) {
        if( error instanceof AppError){
            throw error;
        }

        throw new AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function  isAuthenticated(token) {


     try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        
    
        const user = await userRepository.getUser(response.id)
    
      if (!user) {
            throw new AppError('User not found for the provided token', StatusCodes.UNAUTHORIZED);
        }
        return user;
    } catch(error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
       
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }


}


async function addRoleToUser(data) {
  try {
     const user = await userRepository.get(data.userId);
     if(!user){
        throw new AppError('No user found for the given id',StatusCodes.BAD_REQUEST);
     }
     const role = await roleRepository.getRoleByName(data.roleName);
     if(!role){
        throw new AppError('No role found for the given name',StatusCodes.BAD_REQUEST);
     }
     await user.addRole(role);
     return user;
  } catch (error) {
      if( error instanceof AppError){
           throw error;
        }
        
        if(error.name === 'SequelizeUniqueConstraintError' 
        || error.name ===  'sequelizeUniqueConstraintError'
        || error.name === 'SequelizeDatabaseError'){
           let explanation = [];
           error.errors.forEach((err) => {
               explanation.push(err.message);
           });
           throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        
        throw new AppError(error.message,error.StatusCodes);
  }
}


async function  isAdmin(userId) {


     try {
       
    
        const user = await userRepository.getUser(userId);
     if(!user){
        throw new AppError('No user found for the given id',StatusCodes.BAD_REQUEST);
     }
          
    const adminRole = await roleRepository.getRoleByName(Enums.USER_ROLE.ADMIN);
     if(!adminRole){
        throw new AppError('No admin role found',StatusCodes.BAD_REQUEST);
     }
    
   const isAdmin = await user.hasRole(adminRole);
     if(!isAdmin){
        throw new AppError('User is not an admin',StatusCodes.BAD_REQUEST);
     }
        return isAdmin;

    } catch(error) {
 
        if(error instanceof AppError) {
        throw error;
        }
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
       
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }


}



module.exports = {
    createUser,
    signIn,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}