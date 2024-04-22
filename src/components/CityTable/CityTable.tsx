import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CityTable.css";

const CITY_API_URL = "https://api.openweathermap.org/geo/1.0/direct?q=";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const API_KEY = "c3c13ee52414aef0d7293ac6c8e0f4ec"; // Replace with your OpenWeatherMap API key

const CityTable: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const navigate = useNavigate();
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        });

        if (response.data.results) {
          const citiesData = response.data.results.map((record: any) => ({
            name: record.name,
            country: record.cou_name_en,
            timezone: record.timezone,
          }));

          setCities(citiesData);
          setFilteredCities(citiesData);
          setLoading(false);
        } else {
          setError("No results found");
          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = cities.filter(
      (city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleCityClick = (cityName: string, lat: number, lon: number) => {
    navigate(`/weather/${cityName}/${lat}/${lon}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by city or country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Country</th>
            <th>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city, index) => (
            <tr key={index} onClick={() => handleCityClick(city.name)}>
              <td>{city.name}</td>
              <td>{city.country}</td>
              <td>{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
