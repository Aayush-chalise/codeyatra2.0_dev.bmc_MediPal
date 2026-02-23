import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env';

dotenv.config();

const generateToken = (id , role )  => {
    return jwt.sign(
        {id , role } ,
        JWT_SECRETx, 
        {expiresIn : "30M"}
    )
}

export default generateToken