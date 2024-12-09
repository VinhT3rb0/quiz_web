import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchCategory = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/category/getAll', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        onSelectCategory(categoryId);
        try {
            const response = await axios.get(`https://api.trandai03.online/api/v1/quizs/category/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    return (
        <div>
            <label htmlFor="category-select">Chọn chủ đề:</label>
            <select
                id="category-select"
                value={selectedCategory || ""}
                onChange={(e) => handleCategorySelect(e.target.value)}
            >
                <option value="">--Chọn chủ đề--</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.id} - {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SearchCategory;
