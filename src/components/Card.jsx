import '../App.css';

const Card = ({ user, onClick }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <li className="card-container" onClick={handleClick}>
      <div className="banner">
        <div className="name-container">
          <h4>{user.name.first}&nbsp;</h4>
          <h4>{user.name.last}</h4>
        </div>
      </div>
      <img
        alt="user picture"
        className="profile-picture"
        src={user.picture.large}
      />
      <div className="details">
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <div className="location-container">
          <p>{user.location.city}, &nbsp;</p>
          <p>{user.location.state}</p>
        </div>
      </div>
    </li>
  );
};

export default Card;
