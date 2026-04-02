import { Router } from 'express'
import Group from '../models/Group'

const router = Router()

router.get('/', async (req, res) => {
  const groups = await Group.find().sort({ ageMin: 1 })
  res.json(groups)
})

router.get('/:key', async (req, res) => {
  const group = await Group.findOne({ key: req.params.key })
  if (!group) return res.status(404).json({ message: 'Not found' })
  res.json(group)
})

export default router