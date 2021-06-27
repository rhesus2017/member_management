// react
import React from 'react'
import ReactWordcloud from 'react-wordcloud';

// css
import './Home.css';


const words = [
  {text: 'React', value: Math.random()*100}, {text: 'Login', value: Math.random()*100}, {text: 'Logout', value: Math.random()*100},
  {text: 'Join', value: Math.random()*100}, {text: 'Information', value: Math.random()*100}, {text: 'Member Management', value: Math.random()*100},
  {text: 'Python', value: Math.random()*100}, {text: 'Flask', value: Math.random()*100}, {text: 'MySQL', value: Math.random()*100},
  {text: 'DB', value: Math.random()*100}, {text: 'Socket', value: Math.random()*100}, {text: 'Bcrypt', value: Math.random()*100},
  {text: 'Session', value: Math.random()*100}, {text: 'Pymysql', value: Math.random()*100}, {text: 'Random', value: Math.random()*100},
  {text: 'Cors', value: Math.random()*100}, {text: 'Redux', value: Math.random()*100}, {text: 'Not Found', value: Math.random()*100},
  {text: 'Route', value: Math.random()*100}, {text: 'Local Storage', value: Math.random()*100}, {text: 'useSelect', value: Math.random()*100},
  {text: 'useEffect', value: Math.random()*100}, {text: 'useState', value: Math.random()*100}, {text: 'Axios', value: Math.random()*100},
  {text: 'useHistory', value: Math.random()*100}, {text: 'useDispatch', value: Math.random()*100}, {text: 'Wordcloud', value: Math.random()*100},
  {text: 'Sweet Alert', value: Math.random()*100}, {text: 'useCookies', value: Math.random()*100}, {text: 'Pagination', value: Math.random()*100},
  {text: 'React Select', value: Math.random()*100}
]
const options = {
  colors: ['#fff', '#ccc', '#999', '#666'],
  enableTooltip: false,
  fontFamily: 'Noto Sans KR',
  fontSizes: [10, 70],
  fontStyle: 'normal',
  fontWeight: 'bold',
  padding: 5,
  rotations: 2,
  rotationAngles: false,
  transitionDuration: 1000
};


const Home = () => {

  return(
    <div className='home_wrap'>
      <ReactWordcloud words={words} options={options} />
    </div>
  )
    
}


export default Home;