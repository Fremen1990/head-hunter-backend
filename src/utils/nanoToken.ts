import { customAlphabet } from 'nanoid';

const nanoToken = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 25);
export default nanoToken;
