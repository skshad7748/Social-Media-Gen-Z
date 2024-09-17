import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className='lg:w-fit lg:pr-32 lg:my-10 w-full fixed lg:static bottom-0 bg-white p-4 border-t lg:border-none'>
      {/* User Profile Section */}
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className='hidden lg:block'>
          <h1 className='font-semibold text-sm'>
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>

      {/* Suggested Users Section */}
      <div className='hidden lg:block mt-4'>
        <SuggestedUsers />
      </div>
    </div>
  );
}

export default RightSidebar;
