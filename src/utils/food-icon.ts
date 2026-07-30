import type {ComponentProps} from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface FoodIcon {
    icon: IconName;
    color: string;
}

interface FoodCategory extends FoodIcon {
    keywords: string[];
}

/**
 * Keyword categories stand in for a real semantic embedding lookup (the NLP server already has one via
 */
const CATEGORIES: FoodCategory[] = [
    { icon: 'fish', color: '#4F8FA6', keywords: ['fish', 'salmon', 'tuna', 'prawn', 'shrimp', 'seafood'] },
    { icon: 'food-drumstick', color: '#C77B3C', keywords: ['chicken', 'beef', 'pork', 'lamb', 'steak', 'bacon', 'sausage', 'turkey', 'meat', 'ham'] },
    { icon: 'egg-fried', color: '#D9A227', keywords: ['egg', 'omelette', 'omelet'] },
    { icon: 'pasta', color: '#CC8A3D', keywords: ['pasta', 'spaghetti', 'lasagne', 'ramen', 'bolognese'] },
    { icon: 'noodles', color: '#CC8A3D', keywords: ['noodle', 'noodles'] },
    { icon: 'rice', color: '#B9A45C', keywords: ['rice', 'risotto', 'sushi'] },
    { icon: 'bread-slice', color: '#A9784F', keywords: ['bread', 'toast', 'sandwich', 'bagel', 'baguette', 'bun'] },
    { icon: 'food-croissant', color: '#C99A5B', keywords: ['croissant', 'pastry'] },
    { icon: 'pizza', color: '#C6553B', keywords: ['pizza'] },
    { icon: 'hamburger', color: '#B5652F', keywords: ['burger', 'hamburger'] },
    { icon: 'food-hot-dog', color: '#B5652F', keywords: ['hot dog', 'hotdog'] },
    { icon: 'bowl-mix', color: '#8FA669', keywords: ['yoghurt', 'yogurt', 'muesli', 'granola', 'cereal', 'porridge', 'oats'] },
    { icon: 'cheese', color: '#D9B24C', keywords: ['cheese'] },
    { icon: 'carrot', color: '#DB7C3C', keywords: ['carrot'] },
    { icon: 'sprout', color: '#6E9B57', keywords: ['salad', 'vegetable', 'veg', 'broccoli', 'spinach', 'kale', 'greens'] },
    { icon: 'food-apple', color: '#B04C4C', keywords: ['apple', 'fruit', 'berries', 'berry'] },
    { icon: 'fruit-watermelon', color: '#4C9B6B', keywords: ['watermelon', 'melon'] },
    { icon: 'fruit-citrus', color: '#D9A227', keywords: ['orange', 'citrus', 'lemon'] },
    { icon: 'fruit-grapes', color: '#7A5FA0', keywords: ['grape'] },
    { icon: 'muffin', color: '#B98A54', keywords: ['muffin', 'cupcake', 'cake', 'dessert'] },
    { icon: 'cookie', color: '#A9754A', keywords: ['cookie', 'biscuit'] },
    { icon: 'ice-cream', color: '#5F9BB0', keywords: ['ice cream', 'icecream', 'gelato'] },
    { icon: 'coffee', color: '#6F4E37', keywords: ['coffee', 'latte', 'espresso'] },
    { icon: 'cup', color: '#5F9BB0', keywords: ['tea', 'smoothie', 'juice', 'shake', 'drink'] }
];

const FALLBACK: FoodIcon = { icon: 'silverware-fork-knife', color: '#7A7F87' };

/**
 * Picks an icon + tint for a meal description by matching known food-category keywords, falling back to a
 * generic cutlery icon for anything unrecognised
 */
export function foodIconFor(description: string): FoodIcon {
    const text = description.toLowerCase();

    for (const category of CATEGORIES) {
        if (category.keywords.some((keyword) => text.includes(keyword))) {
            return { icon: category.icon, color: category.color };
        }
    }

    return FALLBACK;
}
