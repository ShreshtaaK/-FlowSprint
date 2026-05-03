import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import projectRoutes from './routes/project.routes' 
import taskRoutes from './routes/task.routes' 
import dashboardRoutes from './routes/dashboard.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/tasks', taskRoutes)         
// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)   
app.use('/api/dashboard', dashboardRoutes)  
// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'FlowSprint API is running ✅',
    version: '1.0.0'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app