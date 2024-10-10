import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaPizzaSlice, FaCoffee, FaAppleAlt, FaHamburger, FaCookieBite, FaBeer, FaCalendarAlt, FaSchool, FaClipboardList } from 'react-icons/fa';
import dayjs from 'dayjs';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const EventDetails = styled.div`
  margin-bottom: 20px;
`;

const EventTitle = styled.h1`
  font-size: 2rem;
  color: #164863;
  margin-bottom: 15px;
  text-align: center;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const EventInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const EventInfo = styled.p`
  font-size: 1.2rem;
  color: #164863;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
`;

const EventDate = styled(EventInfo)``;

const NoOfPeople = styled(EventInfo)``;

const DayInfo = styled(EventInfo)``;

const MealsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const MealSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(50% - 20px);
  box-sizing: border-box;
`;

const MealHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #164863;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemEntry = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 5px 0;
`;

const ItemName = styled.span`
  font-size: 1rem;
  color: #333;
`;

const ItemQuantity = styled.span`
  font-size: 1rem;
  color: #333;
`;

const getIconForMealType = (mealType) => {
  switch (mealType) {
    case 'Breakfast':
      return <FaCoffee />;
    case 'Lunch':
      return <FaHamburger />;
    case 'Dinner':
      return <FaPizzaSlice />;
    case 'Snacks':
      return <FaCookieBite />;
    case 'Beverages':
      return <FaBeer />;
    default:
      return <FaAppleAlt />;
  }
};

const EventDetail = () => {
  const [event, setEvent] = useState(null);
  const { eventId } = useParams();
  
  useEffect(() => {
    if (eventId) {
      axios.get(`${import.meta.env.VITE_RMK_MESS_URL}/event/eventdetail`, {
        params: { eventId }
      })
      .then(response => {
        setEvent(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the event data!", error);
      });
    }
  }, [eventId]);

  if (!event) {
    return <p>Loading...</p>;
  }

  const menuData = Array.isArray(event.meal_details) ? event.meal_details : [];

  return (
    <MenuContainer>
      <EventDetails>
        <EventTitle><FaClipboardList /> {event.event_name}</EventTitle>
        <EventInfoContainer>
          <EventInfo><FaSchool /> {event.institution}</EventInfo>
          <EventDate><FaCalendarAlt /> {dayjs(event.event_date).format("DD-MM-YYYY")}</EventDate>
        </EventInfoContainer>
        <NoOfPeople>No. of People: {event.no_of_people}</NoOfPeople>
        <DayInfo>Day: {event.day}</DayInfo>
      </EventDetails>
      <MealsContainer>
        {menuData.map((meal, index) => (
          <MealSection key={index}>
            <MealHeader>
              {getIconForMealType(meal.mealType)}
              {meal.mealType}
            </MealHeader>
            <ItemList>
              {meal.items.map((item, i) => (
                <ItemEntry key={i}>
                  <ItemName>{item.name}</ItemName>
                  <ItemQuantity>{item.quantity}</ItemQuantity>
                </ItemEntry>
              ))}
            </ItemList>
          </MealSection>
        ))}
      </MealsContainer>
    </MenuContainer>
  );
};

export default EventDetail;
