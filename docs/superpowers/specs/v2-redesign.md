# SchoolBuzzMate v2.0 Redesign Specification

**Status:** Approved for Implementation  
**Date:** 2026-05-20  
**Author:** Claude Code (Strategic Analysis)  
**Stakeholder:** 校趣闪搭 Development Team

---

## Executive Summary

This document specifies the complete redesign of the 校趣闪搭 (SchoolBuzzMate) campus service platform, migrating from the UniApp X/UniCloud stack to a production-grade architecture suitable for commercial operation.

### Key Decisions

| Decision | From | To | Rationale |
|----------|------|-----|-----------|
| Frontend Framework | UniApp X (UTS) | Taro 3 + React + TS | Better ecosystem, WeChat-optimized, larger talent pool |
| Backend Framework | UniCloud (serverless) | Spring Boot 3 + Java 17 | Enterprise standard, massive ecosystem, scalable |
| Architecture | Cloud functions | Modular monolith | Clear boundaries, easier to split later |
| Deploy (Dev) | HBuilderX | 1Panel + Docker | Local Ubuntu server, cost-effective |
| Deploy (Prod) | UniCloud | Tencent Cloud CVM | Full control, no vendor lock-in |

---

## 1. Technical Architecture

### 1.1 Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Taro | 3.x | WeChat Mini Program development |
| Language | React | 18.x | Component model |
| Type System | TypeScript | 5.x | Type safety |
| UI Library | NutUI (React) | 4.x | Mobile-optimized components |
| State | Zustand | 4.x | Lightweight state management |
| HTTP | Taro.request wrapper | - | API communication |
| Styling | SCSS | - | CSS preprocessor |

### 1.2 Backend Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Spring Boot | 3.3+ | Application framework |
| Language | Java | 17+ | Performance, ecosystem |
| Auth | Sa-Token + JWT | - | Session, permission |
| ORM | MyBatis-Plus | 3.5+ | Data access |
| Cache | Redis | 7.x | Session, hot data |
| Database | MySQL | 8.0 | Transactional data |
| Search | Elasticsearch | 8.x | Full-text (add later) |
| WebSocket | Spring WebSocket | - | Real-time chat |

### 1.3 Infrastructure

| Layer | Technology | Environment |
|-------|------------|-------------|
| Container | Docker | Dev + Prod |
| Orchestration | Docker Compose | Dev (1Panel) |
| Cloud | Tencent Cloud CVM | Production |
| CI/CD | GitHub Actions | All |
| Storage | Tencent COS | File storage |

### 1.4 Project Structure

```
SchoolBuzzMate-Taro/                    # Root repository
├── campus-mini/                        # Taro 3 frontend
│   ├── src/
│   │   ├── app.ts                      # Entry
│   │   ├── app.config.ts               # Pages, tabBar config
│   │   ├── pages/                      # Page components
│   │   │   ├── index/                  # Home
│   │   │   ├── buddy/                  # 找搭子
│   │   │   ├── delivery/               # 跑腿
│   │   │   ├── forum/                  # 论坛
│   │   │   ├── messages/               # 消息
│   │   │   └── user/                   # 个人中心
│   │   ├── components/                 # Shared components
│   │   ├── stores/                     # Zustand stores
│   │   ├── services/                   # API services
│   │   ├── hooks/                      # Custom hooks
│   │   └── styles/                     # Global styles
│   ├── package.json
│   └── tsconfig.json
├── campus-api/                         # Spring Boot backend
│   ├── pom.xml                         # Maven parent
│   ├── campus-auth/                    # Auth module
│   ├── campus-common/                  # Common utilities
│   ├── campus-user/                    # User module
│   ├── campus-buddy/                   # 找搭子 module
│   ├── campus-delivery/                # 跑腿 module
│   ├── campus-forum/                   # 论坛 module
│   ├── campus-order/                   # 订单 module
│   ├── campus-message/                 # 消息 module
│   ├── campus-api/                     # Main API (aggregator)
│   │   └── src/main/java/com/campus/api/
│   │       └── ApiApplication.java     # @SpringBootApplication
│   └── campus-admin/                   # Admin backend
├── docker-compose.yml                  # Local dev stack
├── Dockerfile                          # App container
└── README.md
```

---

## 2. Database Schema

### 2.1 Core Tables

```sql
-- Users
create table users (
    id bigint primary key auto_increment,
    openid varchar(64) not null unique,
    unionid varchar(64),
    nickname varchar(50),
    avatar varchar(500),
    gender tinyint default 0,
    phone varchar(20),
    campus_id bigint,
    student_no varchar(50),
    verified tinyint default 0,
    credit_score int default 80,
    status tinyint default 1,
    created_at datetime default now(),
    updated_at datetime default now(),
    index idx_campus (campus_id),
    index idx_openid (openid)
);

-- User Tags
create table user_tags (
    id bigint primary key auto_increment,
    user_id bigint not null,
    tag varchar(30) not null,
    created_at datetime default now(),
    unique key uk_user_tag (user_id, tag)
);

-- Campus
create table campuses (
    id bigint primary key auto_increment,
    name varchar(100) not null,
    province varchar(50),
    city varchar(50),
    address varchar(200),
    lat decimal(10, 8),
    lng decimal(11, 8),
    status tinyint default 1
);

-- Buddy Requests (找搭子)
create table buddy_requests (
    id bigint primary key auto_increment,
    user_id bigint not null,
    type enum('study', 'sport', 'game', 'eat', 'travel', 'other'),
    tags json,
    title varchar(100) not null,
    content text,
    location varchar(100),
    lat decimal(10, 8),
    lng decimal(11, 8),
    start_time datetime,
    end_time datetime,
    max_participants int default 2,
    current_participants int default 1,
    status enum('open', 'filled', 'completed', 'cancelled') default 'open',
    view_count int default 0,
    created_at datetime default now(),
    updated_at datetime default now(),
    index idx_user (user_id),
    index idx_status (status),
    index idx_time (start_time),
    index idx_geo (lat, lng)
);

-- Buddy Participants
create table buddy_participants (
    id bigint primary key auto_increment,
    request_id bigint not null,
    user_id bigint not null,
    status enum('pending', 'accepted', 'rejected', 'left') default 'pending',
    joined_at datetime default now(),
    unique key uk_participant (request_id, user_id)
);

-- Delivery Requests (跑腿)
create table delivery_requests (
    id bigint primary key auto_increment,
    user_id bigint not null,
    type enum('express', 'food', 'errand', 'other'),
    title varchar(100) not null,
    description text,
    from_location varchar(100),
    to_location varchar(100),
    lat decimal(10, 8),
    lng decimal(11, 8),
    amount decimal(10, 2) not null,
    deadline datetime,
    taker_id bigint,
    status enum('open', 'taken', 'delivering', 'completed', 'cancelled') default 'open',
    created_at datetime default now(),
    updated_at datetime default now(),
    index idx_user (user_id),
    index idx_status (status),
    index idx_taker (taker_id)
);

-- Orders
create table orders (
    id bigint primary key auto_increment,
    order_no varchar(32) not null unique,
    user_id bigint not null,
    request_id bigint,
    request_type enum('buddy', 'delivery'),
    amount decimal(10, 2) not null,
    fee decimal(10, 2) default 0,
    total_amount decimal(10, 2) not null,
    status enum('unpaid', 'paid', 'refunding', 'refunded', 'completed') default 'unpaid',
    pay_time datetime,
    transaction_id varchar(64),
    created_at datetime default now(),
    updated_at datetime default now(),
    index idx_user (user_id),
    index idx_status (status)
);

-- Messages
create table messages (
    id bigint primary key auto_increment,
    type enum('system', 'order', 'chat', 'comment'),
    sender_id bigint,
    receiver_id bigint not null,
    request_id bigint,
    title varchar(100),
    content text,
    extras json,
    read tinyint default 0,
    read_at datetime,
    created_at datetime default now(),
    index idx_receiver (receiver_id, read),
    index idx_created (created_at)
);

-- Chats (WebSocket sessions)
create table chats (
    id bigint primary key auto_increment,
    chat_no varchar(32) not null unique,
    request_id bigint,
    user_id_1 bigint not null,
    user_id_2 bigint not null,
    last_message_id bigint,
    last_message_time datetime,
    unread_count_1 int default 0,
    unread_count_2 int default 0,
    created_at datetime default now(),
    unique key uk_users (least(user_id_1, user_id_2), greatest(user_id_1, user_id_2))
);

-- Chat Messages
create table chat_messages (
    id bigint primary key auto_increment,
    chat_id bigint not null,
    sender_id bigint not null,
    type enum('text', 'image', 'voice'),
    content text,
    url varchar(500),
    read tinyint default 0,
    created_at datetime default now(),
    index idx_chat (chat_id, created_at)
);

-- Forum Posts
create table forum_posts (
    id bigint primary key auto_increment,
    user_id bigint not null,
    category enum('trade', 'lost', 'found', 'confession', 'news', 'help'),
    title varchar(100) not null,
    content text,
    images json,
    view_count int default 0,
    like_count int default 0,
    comment_count int default 0,
    status enum('published', 'hidden', 'deleted') default 'published',
    created_at datetime default now(),
    updated_at datetime default now(),
    index idx_user (user_id),
    index idx_category (category),
    index idx_status (status),
    index idx_created (created_at)
);

-- User Ratings
create table user_ratings (
    id bigint primary key auto_increment,
    order_id bigint not null,
    from_user_id bigint not null,
    to_user_id bigint not null,
    rating tinyint not null check (rating between 1 and 5),
    content varchar(200),
    tags json,
    created_at datetime default now(),
    unique key uk_order (order_id, from_user_id)
);
```

---

## 3. API Design

### 3.1 RESTful Endpoints

```
# Authentication
POST   /api/v1/auth/login              # WeChat login
POST   /api/v1/auth/refresh            # Refresh token
POST   /api/v1/auth/logout            # Logout

# Users
GET    /api/v1/users/me                # Current user
GET    /api/v1/users/{id}              # User profile
PUT    /api/v1/users/me                # Update profile
POST   /api/v1/users/verify            # Campus verification
GET    /api/v1/users/{id}/ratings      # User ratings

# Buddy (找搭子)
GET    /api/v1/buddy                   # List with filters
POST   /api/v1/buddy                   # Create request
GET    /api/v1/buddy/{id}              # Request detail
PUT    /api/v1/buddy/{id}              # Update request
DELETE /api/v1/buddy/{id}              # Delete/cancel
POST   /api/v1/buddy/{id}/join         # Join request
POST   /api/v1/buddy/{id}/leave        # Leave request
GET    /api/v1/buddy/{id}/participants # List participants

# Matching (AI推荐)
GET    /api/v1/buddy/match             # Get matched requests

# Delivery (跑腿)
GET    /api/v1/delivery                # List with filters
POST   /api/v1/delivery                # Create request
GET    /api/v1/delivery/{id}           # Request detail
POST   /api/v1/delivery/{id}/take       # Take order
POST   /api/v1/delivery/{id}/complete   # Mark complete

# Orders
GET    /api/v1/orders                  # My orders
GET    /api/v1/orders/{id}             # Order detail
POST   /api/v1/orders                  # Create order
POST   /api/v1/orders/{id}/pay         # Initiate payment
POST   /api/v1/orders/{id}/cancel      # Cancel order

# Messages
GET    /api/v1/messages                # Message list
PUT    /api/v1/messages/{id}/read     # Mark as read
GET    /api/v1/messages/unread-count   # Unread count

# Chats (WebSocket for realtime)
GET    /api/v1/chats                   # Chat list
GET    /api/v1/chats/{id}/messages     # Chat history
POST   /api/v1/chats/{id}/messages     # Send message (fallback)

# Forum
GET    /api/v1/forum                   # Post list
POST   /api/v1/forum                   # Create post
GET    /api/v1/forum/{id}              # Post detail
POST   /api/v1/forum/{id}/like         # Like/unlike
GET    /api/v1/forum/{id}/comments     # Comments
POST   /api/v1/forum/{id}/comments     # Add comment

# Search (Elasticsearch)
GET    /api/v1/search                  # Global search
```

### 3.2 WebSocket Endpoints

```
# Connection
wss://api.example.com/ws

# Message Types
{
  "type": "chat_message",      # Chat message
  "type": "chat_read",         # Mark as read
  "type": "notification",      # System notification
  "type": "typing",            # Typing indicator
  "type": "ping/pong"          # Keepalive
}

# Subscribe
SUB /topic/chat/{chatId}         # Subscribe to chat
SUB /topic/user/{userId}         # Subscribe to user notifications
```

### 3.3 Response Format

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1716201600000
}

// Error Response
{
  "code": 40001,
  "message": "Invalid parameters",
  "data": null,
  "timestamp": 1716201600000
}
```

---

## 4. Business Logic

### 4.1 Matching Algorithm (找搭子)

```java
public List<BuddyMatchVO> findMatches(Long userId, MatchQuery query) {
    User user = userService.getById(userId);
    List<String> userTags = userTagService.getTags(userId);
    
    // Step 1: Filter candidates
    List<BuddyRequest> candidates = lambdaQuery()
        .eq(BuddyRequest::getCampusId, user.getCampusId())
        .eq(BuddyRequest::getStatus, "open")
        .ne(BuddyRequest::getUserId, userId)
        .ge(BuddyRequest::getStartTime, query.getStartTime())
        .le(BuddyRequest::getStartTime, query.getEndTime())
        .list();
    
    // Step 2: Score candidates
    List<BuddyMatchVO> matches = candidates.stream()
        .map(req -> {
            double score = calculateMatchScore(user, req, userTags);
            return new BuddyMatchVO(req, score);
        })
        .sorted(Comparator.comparing(BuddyMatchVO::getScore).reversed())
        .limit(20)
        .collect(Collectors.toList());
    
    return matches;
}

private double calculateMatchScore(User user, BuddyRequest req, List<String> userTags) {
    double score = 0;
    
    // Tag overlap (50% weight)
    List<String> reqTags = req.getTags();
    long overlap = userTags.stream().filter(reqTags::contains).count();
    score += (overlap / Math.max(userTags.size(), reqTags.size())) * 50;
    
    // Proximity (30% weight)
    double distance = GeoUtils.distance(user.getLat(), user.getLng(), req.getLat(), req.getLng());
    score += Math.max(0, 30 - distance * 10); // Closer = higher score
    
    // Mutual friends (20% weight)
    int mutualFriends = friendService.countMutual(user.getId(), req.getUserId());
    score += Math.min(mutualFriends * 5, 20);
    
    return score;
}
```

### 4.2 Order Lifecycle

```
Delivery Request:
  ┌─────────┐
  │  OPEN   │ ← User publishes request
  └────┬────┘
       │ Someone takes it
       ▼
  ┌─────────┐
  │  TAKEN  │ ← Taker assigned
  └────┬────┘
       │ Taker picks up
       ▼
  ┌─────────┐
  │DELIVERING│ ← In progress
  └────┬────┘
       │ Delivered
       ▼
  ┌─────────┐
  │COMPLETED│ ← Both confirm
  └─────────┘

Cancellation:
  - OPEN: Publisher can cancel anytime
  - TAKEN: Both can cancel (affects credit score)
  - DELIVERING: Only with platform arbitration
```

### 4.3 Credit Score Algorithm

```java
public int calculateCreditScore(Long userId) {
    // Base score
    int score = 80;
    
    // Completion rate (+/- 20)
    double completionRate = orderService.getCompletionRate(userId);
    score += (int) ((completionRate - 0.8) * 100);
    
    // Rating average (+/- 10)
    double avgRating = ratingService.getAverageRating(userId);
    score += (int) ((avgRating - 3) * 5);
    
    // Cancellation penalty (-5 per cancellation)
    int cancellations = orderService.getCancellationCount(userId);
    score -= cancellations * 5;
    
    // Verification bonus (+10)
    User user = userService.getById(userId);
    if (user.getVerified() == 1) score += 10;
    
    return Math.min(100, Math.max(0, score));
}
```

---

## 5. Security Design

### 5.1 Authentication Flow

```
1. User opens mini program
2. Taro.getUserInfo() gets basic info
3. Taro.login() gets wx.login code
4. POST /api/v1/auth/login {code}
5. Backend calls WeChat API: code → openid
6. Backend: openid exists? → return JWT
   - new user? → create user → return JWT
7. Frontend stores token in Zustand + localStorage
8. All subsequent requests: Authorization: Bearer {token}
```

### 5.2 Permission Model (RBAC v2)

```
Roles: USER, CAMPUS_ADMIN, SUPER_ADMIN

USER permissions:
  - buddy:read, buddy:create, buddy:update:own
  - delivery:read, delivery:create, delivery:update:own
  - order:read, order:create:own
  - message:read, message:create

CAMPUS_ADMIN: (per campus)
  - All USER permissions
  - post:moderate
  - user:verify

SUPER_ADMIN:
  - All permissions
  - system:manage
```

### 5.3 Data Security

```
Sensitive Fields Encryption:
  - phone: AES-256
  - student_no: AES-256
  - openid: Hash (not encrypted, used for lookup)

API Security:
  - Rate limiting: 100 req/min per user
  - Request signing: HMAC-SHA256 for payment callbacks
  - CORS: Whitelist mini program domains only
```

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Setup: Taro 3 + NutUI + Zustand scaffold
- [ ] Setup: Spring Boot + MyBatis-Plus + Sa-Token
- [ ] Setup: 1Panel + Docker Compose (local dev)
- [ ] DB: Create tables, flyway migrations
- [ ] API: WeChat login + JWT authentication

### Phase 2: Core Features (Weeks 3-6)
- [ ] Feature: User profile + campus verification
- [ ] Feature: 找搭子 CRUD + simple list
- [ ] Feature: 跑腿 CRUD + simple list
- [ ] Feature: Basic forum (posts + comments)
- [ ] Feature: Message list (async)

### Phase 3: Real-time + Trust (Weeks 7-10)
- [ ] Feature: WebSocket chat
- [ ] Feature: Matching algorithm
- [ ] Feature: Order lifecycle
- [ ] Feature: Credit scoring
- [ ] Feature: Rating system

### Phase 4: Payment + Polish (Weeks 11-14)
- [ ] Feature: WeChat Pay integration
- [ ] Feature: Admin dashboard
- [ ] Feature: Push notifications
- [ ] Performance: Redis caching
- [ ] Performance: Database indexing

### Phase 5: Scale (Weeks 15-16)
- [ ] Setup: Tencent Cloud CVM production
- [ ] Setup: CI/CD pipeline
- [ ] Feature: Multi-campus support
- [ ] Testing: Load testing, security audit

---

## 7. Monetization

### Revenue Model

| Stream | Implementation | Timeline |
|--------|---------------|----------|
| Transaction Fee | 5-10% per delivery order | Phase 4 |
| Promoted Listings | 1-5 yuan/day for top placement | Phase 4 |
| Membership | 9.9 yuan/month: free fees, discounts | Phase 5 |
| Advertising | Forum feed ads (CPM) | Phase 5 |

### Pricing Tiers

```
Free User:
  - All features
  - Standard listing
  - 10% service fee

Member (9.9 yuan/month):
  - Service fee waived
  - 3 free promoted listings/month
  - Priority matching
  - Exclusive badge
```

---

## 8. UI/UX Evolution

### Design System Updates

```
Keep:
  - Bold color palette (teal #4ECDC4, red #FF6B6B)
  - Hand-drawn elements (doodles, tape)
  - High contrast, clear hierarchy

Evolve:
  - Rounded corners (12rpx) on cards
  - More whitespace, breathing room
  - Skeleton screens for loading states
  - Micro-animations (bounce, fade, slide)
  - Dark mode support

Color Palette v2:
  - Primary: #4ECDC4 (teal)
  - Secondary: #FF6B6B (red)
  - Background: #F8F9FA (soft gray)
  - Surface: #FFFFFF
  - Success: #4CAF50
  - Warning: #FFC107
  - Text Primary: #1A1A1A
  - Text Secondary: #666666
```

### Key Screen Improvements

| Screen | Current | Improved |
|--------|---------|----------|
| 首页 | Static cards | Personalized feed with "For You" |
| 找搭子 | List view | Card stack with match %, swipe gestures |
| 跑腿 | Text list | Map view + list dual mode |
| 聊天 | None | Full chat with typing indicators |
| 个人中心 | Basic | Gamified credit score, achievements |

---

## 9. Performance Targets

### Backend SLAs

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response | < 200ms (p95) | APM monitoring |
| WebSocket Latency | < 100ms | Ping test |
| Database Query | < 50ms (p95) | Slow query log |
| Error Rate | < 0.1% | Sentry alerts |

### Frontend Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Bundle Size | < 500KB | Build analyzer |
| Image Load | Lazy + progressive | Intersection Observer |

---

## 10. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WeChat API changes | Medium | High | Monitor changelogs, abstraction layer |
| Payment compliance | Medium | High | Follow WeChat Pay guidelines, legal review |
| Campus competition | High | Medium | Differentiation: matching algorithm, trust |
| Credit system abuse | Medium | Medium | Rate limiting, manual review |
| Scaling costs | Low | Medium | Start small, monitor usage |

---

## Appendix A: Migration Checklist

### From UniApp X to Taro

- [ ] Convert Vue 3 Composition API → React Hooks
  - `ref()` → `useState()`
  - `computed()` → `useMemo()`
  - `watch()` → `useEffect()`
  - `onMounted()` → `useEffect(() => {}, [])`
  - `defineProps<Props>()` → `interface Props {}`
- [ ] Convert SCSS styles (mostly compatible)
- [ ] Replace `uni.request` → Taro.request wrapper
- [ ] Replace `uniCloud` calls → REST API calls
- [ ] Convert page navigation (`uni.navigateTo` → Taro.navigateTo)
- [ ] Migrate Pinia stores → Zustand

### From UniCloud to Spring Boot

- [ ] Convert JQL queries → MyBatis-Plus
- [ ] Convert cloud functions → Controller + Service
- [ ] Convert schema permissions → Sa-Token RBAC
- [ ] Convert UniCloud DB triggers → Application events

---

## Document Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Tech Lead | | | ☐ Approved |
| Product Manager | | | ☐ Approved |
| Stakeholder | | | ☐ Approved |

---

**End of Specification**
