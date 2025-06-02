# 🚀 Smart Choice Engine

**AI-Powered Product Recommendation System**

A modern, intelligent recommendation engine built with **Fresh + Deno + TypeScript** that delivers personalized product suggestions using advanced machine learning algorithms.

![Smart Choice Engine](https://img.shields.io/badge/Smart%20Choice-Engine-emerald?style=for-the-badge)
![Fresh](https://img.shields.io/badge/Fresh-1.7.3-00D2FF?style=flat-square&logo=deno)
![Deno](https://img.shields.io/badge/Deno-2.0-000000?style=flat-square&logo=deno)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)

## 🎯 Features

### 🤖 **Intelligent Recommendations**
- **Collaborative Filtering** - Analyzes user behavior patterns
- **Content-Based Filtering** - Matches products to customer preferences  
- **Behavioral Analysis** - Real-time scoring based on user interactions
- **Dynamic Personalization** - Adapts recommendations per customer segment

### 🎨 **Modern UI/UX**
- **Dark Professional Theme** - Enterprise-grade design with emerald accents
- **Responsive Layout** - Works seamlessly on all devices
- **Real-time Updates** - Instant recommendation refresh on customer selection
- **Confidence Scoring** - Visual indicators for recommendation accuracy

### ⚡ **Performance & Tech Stack**
- **Frontend**: Fresh 1.7.3 + Preact + TailwindCSS
- **Backend**: Deno + Oak + TypeScript
- **Hot Reload** - Instant development feedback
- **Zero Runtime Dependencies** - Pure Deno stack

## 🚀 Quick Start

### Prerequisites
- **Deno 2.0+** installed ([Get Deno](https://deno.land/manual/getting_started/installation))

### 1. Clone Repository
```bash
git clone https://github.com/screamm/Smart_Choice_Engine.git
cd Smart_Choice_Engine
```

### 2. Start Backend API
```bash
cd backend
deno task start
```
**Backend runs on**: `http://localhost:8000`

### 3. Start Frontend (New Terminal)
```bash
cd frontend/fresh-frontend  
deno task start
```
**Frontend runs on**: `http://localhost:8090`

### 4. Open Application
Visit: **http://localhost:8090**

## 🎮 Usage

1. **Select Customer** - Choose from dropdown (Emma, Johan, Lisa)
2. **View Recommendations** - See personalized AI-generated products
3. **Analyze Confidence** - Check recommendation accuracy scores
4. **Explore Algorithms** - See which ML models contributed

## 🏗️ Architecture

```
Smart Choice Engine/
├── 🔥 frontend/fresh-frontend/     # Fresh + Preact frontend
│   ├── routes/                     # Pages & API routes
│   ├── islands/                    # Interactive components
│   ├── data/                       # Mock data & ML algorithms
│   └── static/                     # Assets & styles
│
├── ⚡ backend/                     # Deno + Oak API server  
│   ├── main.ts                     # Server & recommendation logic
│   └── deno.json                   # Configuration
│
└── 📝 Documentation/
    ├── README.md                   # This file
    └── START_GUIDE.md              # Quick setup guide
```

## 🧠 Machine Learning Algorithms

### **Collaborative Filtering**
```typescript
// Analyzes customer behavior patterns
const collaborativeScore = calculateSimilarCustomers(customerId)
  .map(similar => similar.preferences)
  .reduce((score, prefs) => score + prefs.weight, 0);
```

### **Content-Based Filtering**  
```typescript
// Matches products to customer preferences
const contentScore = customer.favoriteCategories
  .filter(cat => product.categories.includes(cat))
  .length / customer.favoriteCategories.length;
```

### **Behavioral Analysis**
```typescript
// Real-time behavior scoring
const behaviorScore = (customer.behaviorScore * 0.7) + 
                     (customer.purchaseFrequency * 0.3);
```

## 🎨 UI Components

### **Customer Dashboard**
- Real-time metrics (purchases, avg order value, behavior score)
- Interactive category tags
- Location & activity tracking

### **Recommendation Cards**  
- Product imagery with confidence badges
- Price & detailed reasoning
- Algorithm attribution tags
- Hover effects & animations

### **System Status**
- Live customer count
- Active session indicator  
- Performance metrics

## 🔧 Development

### **Available Commands**
```bash
# Frontend
deno task start      # Start dev server
deno task build      # Build for production
deno task check      # Type checking

# Backend  
deno task start      # Start API server
```

### **Configuration**
- **JSX**: `react-jsx` with Preact
- **Import Maps**: ESM.sh for dependencies
- **TypeScript**: Strict mode enabled
- **Hot Reload**: File watching enabled

## 🌐 Deployment

### **Deno Deploy** (Recommended)
```bash
# Deploy frontend
deployctl deploy --project=smart-choice frontend/fresh-frontend/main.ts

# Deploy backend API
deployctl deploy --project=smart-choice-api backend/main.ts
```

### **Docker**
```dockerfile
FROM denoland/deno:alpine
WORKDIR /app
COPY . .
RUN deno cache frontend/fresh-frontend/main.ts
EXPOSE 8090
CMD ["deno", "run", "-A", "frontend/fresh-frontend/main.ts"]
```

## 📊 Sample Data

The engine includes **3 customer personas**:

- **👩 Emma** - Fashion enthusiast, Stockholm
- **👨 Johan** - Tech professional, Göteborg  
- **👩 Lisa** - Beauty expert, Malmö

Each customer has **unique behavioral patterns** that generate different recommendations using our ML algorithms.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/screamm/Smart_Choice_Engine](https://github.com/screamm/Smart_Choice_Engine)
- **Fresh Framework**: [https://fresh.deno.dev](https://fresh.deno.dev)
- **Deno Runtime**: [https://deno.land](https://deno.land)

---

**Built with ❤️ using Fresh + Deno + TypeScript**

*Smart Choice Engine - Making AI recommendations accessible and intelligent.* 