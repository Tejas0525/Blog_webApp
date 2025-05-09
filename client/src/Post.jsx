import {format} from 'date-fns'

export default function Post({title,summary,cover,content,createdAt,author}){
    return(
        <div className="post">
          <img src={'http://localhost:8000/'+cover} alt=''></img>
          <div className="texts">
          <h2>{title}</h2>
          <p className="info">
            <a className='author'>{author.username}</a>
            <time>{format(new Date(createdAt),'d MMM yyyy HH:mm')}</time>
          </p>
          <p className='summary'>{summary}</p>
          </div>
          </div>
    );
}