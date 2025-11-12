const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Unlimited Data Plan",
        description: "Perfect for heavy internet users with unlimited data, high-speed streaming, and no throttling.",
        category: "data",
        price: 79.99,
        features: [
            "Unlimited 4G/5G data",
            "High-speed streaming",
            "No data throttling",
            "24/7 customer support"
        ],
        dataAllowance: "Unlimited",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        isFeatured: true
    },
    {
        name: "Premium Voice Package",
        description: "Unlimited voice calls to all networks with crystal clear quality and international calling options.",
        category: "voice",
        price: 29.99,
        features: [
            "Unlimited voice calls",
            "International calling included",
            "HD voice quality",
            "Call waiting & forwarding"
        ],
        dataAllowance: "N/A",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
        isFeatured: true
    },
    {
        name: "SMS Bundle Pro",
        description: "Send unlimited SMS messages to any network with instant delivery and read receipts.",
        category: "sms",
        price: 9.99,
        features: [
            "Unlimited SMS",
            "Instant delivery",
            "Read receipts",
            "Group messaging support"
        ],
        dataAllowance: "N/A",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop",
        isFeatured: false
    },
    {
        name: "Streaming VOD Package",
        description: "Access premium video-on-demand content with 4K streaming and exclusive shows.",
        category: "vod",
        price: 19.99,
        features: [
            "4K streaming quality",
            "Exclusive content",
            "Multiple device support",
            "Offline downloads"
        ],
        dataAllowance: "50GB for streaming",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop",
        isFeatured: true
    },
    {
        name: "Complete Bundle",
        description: "All-in-one package combining data, voice, SMS, and VOD services at a discounted price.",
        category: "bundle",
        price: 99.99,
        features: [
            "100GB high-speed data",
            "Unlimited voice calls",
            "Unlimited SMS",
            "VOD access included",
            "Best value package"
        ],
        dataAllowance: "100GB",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        isFeatured: true
    },
    {
        name: "Budget Data Plan",
        description: "Affordable data plan perfect for light users with essential internet connectivity.",
        category: "data",
        price: 19.99,
        features: [
            "10GB data",
            "4G speeds",
            "Basic connectivity",
            "Budget-friendly"
        ],
        dataAllowance: "10GB",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        isFeatured: false
    },
    {
        name: "Standard Voice Plan",
        description: "Moderate voice calling package with good coverage and call quality.",
        category: "voice",
        price: 14.99,
        features: [
            "500 minutes",
            "Standard quality",
            "Local calls only",
            "Affordable pricing"
        ],
        dataAllowance: "N/A",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
        isFeatured: false
    },
    {
        name: "Basic SMS Plan",
        description: "Essential SMS package for occasional messaging needs.",
        category: "sms",
        price: 4.99,
        features: [
            "100 SMS",
            "Standard delivery",
            "Basic features",
            "Low cost"
        ],
        dataAllowance: "N/A",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop",
        isFeatured: false
    },
    {
        name: "Standard VOD Access",
        description: "Basic video-on-demand access with standard quality streaming.",
        category: "vod",
        price: 12.99,
        features: [
            "HD streaming",
            "Standard library",
            "Single device",
            "Basic features"
        ],
        dataAllowance: "20GB for streaming",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop",
        isFeatured: false
    },
    {
        name: "Family Bundle",
        description: "Comprehensive bundle for families with multiple lines and shared benefits.",
        category: "bundle",
        price: 149.99,
        features: [
            "200GB shared data",
            "Unlimited family calls",
            "Unlimited SMS",
            "VOD for all devices",
            "Family sharing"
        ],
        dataAllowance: "200GB shared",
        validity: "30 days",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        isFeatured: true
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://your-connection-string', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log(`Successfully seeded ${sampleProducts.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();

