import { TUser } from "../store/user";

const isMe = (preUser: TUser, nextUser: TUser) => {
  if (preUser.id === nextUser.id) {
    return true;
  } else {
    return false;
  }
};

export default isMe;
