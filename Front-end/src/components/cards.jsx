import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function BikeCard({ bike }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={bike.imageUrl} />
      <Card.Body>
        <Card.Title>{bike.model}</Card.Title>
        <div>{bike.make}</div>
        <div>{bike.description}</div>
        <div>{bike.price}</div>
        <Button variant="primary">Add to trip</Button>
      </Card.Body>
    </Card>
  );
}

export default BikeCard;

