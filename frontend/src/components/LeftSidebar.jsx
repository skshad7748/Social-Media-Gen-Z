import { setAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import { Heart, Home, LogOut, Menu, MessageCircle, PlusSquare, Search, TrendingUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Logo from '../assets/logo.png';
import CreatePost from './CreatePost';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();
  
  const [open, setOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Track sidebar visibility

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://social-media-gen-z-2.onrender.com/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case 'Logout':
        logoutHandler();
        break;
      case 'Create':
        setOpen(true);
        break;
      case 'Profile':
        navigate(`/profile/${user?._id}`);
        break;
      case 'Home':
        navigate('/');
        break;
      case 'Messages':
        navigate('/chat');
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notifications' },
    { icon: <PlusSquare />, text: 'Create' },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt={user?.username} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];
  
  // Reference for the sidebar
  const sidebarRef = useRef();

  // Function to close sidebar when clicking outside
  const handleClickOutside = (event) => {
    if (sidebarVisible && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarVisible(false);
    }
  };

  // Use effect to listen for clicks outside
  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarVisible]);

  return (
    <div>
      {/* Hamburger Menu for Small Screens */}
      <div className="lg:hidden flex justify-between items-center p-4">
        <button onClick={() => navigate('/')}>
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
        </button>
        <button onClick={() => setSidebarVisible(prev => !prev)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`fixed top-0 right-0 z-10 h-screen w-64 bg-white border-l border-gray-300 shadow-lg transition-transform ${sidebarVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4">
          <button onClick={() => navigate('/')}>
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
          </button>
          {/* Close Button */}
          <button onClick={() => setSidebarVisible(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Container for Logo and Sidebar Items */}
        <div className="flex flex-col items-center h-full p-4">
          {/* Sidebar Items */}
          <div className="flex flex-col gap-2 w-full">
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="text-xs lg:text-base">{item.text}</span>
                {item.text === 'Notifications' && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-700 transition-colors duration-200 ml-auto"
                      >
                        {likeNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {likeNotification.length === 0 ? (
                          <p>No new notification</p>
                        ) : (
                          likeNotification.map((notification) => (
                            <div key={notification.userId} className="flex items-center gap-2 my-2">
                              <Avatar>
                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <p className="text-sm">
                                <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Create Post Modal */}
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default LeftSidebar;