'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calculator, AlertTriangle, Info, Clock, Star, Zap } from 'lucide-react'
import { format } from 'date-fns'

export default function Calculators() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Astrological Calculators</h1>
        <p className="text-muted-foreground">
          Specialized tools for advanced astrological analysis and dosha calculations.
        </p>
      </div>

      <Tabs defaultValue="sade-sati" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sade-sati">Sade Sati</TabsTrigger>
          <TabsTrigger value="kuja-dosha">Kuja Dosha</TabsTrigger>
          <TabsTrigger value="kalasarpa">Kalasarpa</TabsTrigger>
          <TabsTrigger value="mangal">Mangal</TabsTrigger>
        </TabsList>

        <TabsContent value="sade-sati" className="mt-6">
          <SadeSatiCalculator />
        </TabsContent>

        <TabsContent value="kuja-dosha" className="mt-6">
          <KujaDoshaCalculator />
        </TabsContent>

        <TabsContent value="kalasarpa" className="mt-6">
          <KalasarpaCalculator />
        </TabsContent>

        <TabsContent value="mangal" className="mt-6">
          <MangalCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SadeSatiCalculator() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    currentDate: format(new Date(), 'yyyy-MM-dd')
  })
  const [result, setResult] = useState<any>(null)

  const calculateSadeSati = () => {
    if (!formData.birthDate || !formData.birthTime) return

    const birthDate = new Date(`${formData.birthDate}T${formData.birthTime}`)
    const currentDate = new Date(formData.currentDate)
    
    // Simulate Sade Sati calculation
    const birthYear = birthDate.getFullYear()
    const currentYear = currentDate.getFullYear()
    const age = currentYear - birthYear
    
    // Saturn takes ~29.5 years to complete one cycle
    const saturnCycle = Math.floor(age / 29.5)
    const saturnPosition = (age % 29.5) / 29.5 * 12 // 12 signs
    
    let sadeSatiStatus = 'Not in Sade Sati'
    let severity = 'None'
    let description = ''
    
    // Sade Sati occurs when Saturn transits through 12th, 1st, and 2nd houses from Moon
    if (saturnPosition >= 11.5 || saturnPosition <= 2.5) {
      sadeSatiStatus = 'Currently in Sade Sati'
      
      if (saturnPosition >= 11.5 && saturnPosition <= 12.5) {
        severity = 'First Phase'
        description = 'Saturn in 12th house - End of previous cycle, preparation for new phase'
      } else if (saturnPosition >= 0.5 && saturnPosition <= 1.5) {
        severity = 'Second Phase'
        description = 'Saturn in 1st house - Most challenging period, major life changes'
      } else if (saturnPosition >= 1.5 && saturnPosition <= 2.5) {
        severity = 'Third Phase'
        description = 'Saturn in 2nd house - Beginning of recovery, new opportunities'
      }
    }

    setResult({
      status: sadeSatiStatus,
      severity,
      description,
      saturnPosition: saturnPosition.toFixed(1),
      nextSadeSati: saturnPosition < 11.5 ? 
        `${Math.ceil(11.5 - saturnPosition) * 2.5} years` : 
        `${Math.ceil(35.5 - saturnPosition) * 2.5} years`
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Sade Sati Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="birthTime">Birth Time</Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="currentDate">Current Date</Label>
                <Input
                  id="currentDate"
                  type="date"
                  value={formData.currentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentDate: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={calculateSadeSati} className="w-full">
              Calculate Sade Sati
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">Status:</span>
                <Badge variant={result.status.includes('Currently') ? 'destructive' : 'secondary'}>
                  {result.status}
                </Badge>
              </div>
              
              {result.severity !== 'None' && (
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">Phase:</span>
                  <Badge variant="outline">{result.severity}</Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">Saturn Position:</span>
                <span>House {result.saturnPosition}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">Next Sade Sati:</span>
                <span>{result.nextSadeSati}</span>
              </div>
              
              {result.description && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{result.description}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function KujaDoshaCalculator() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    gender: 'male'
  })
  const [result, setResult] = useState<any>(null)

  const calculateKujaDosha = () => {
    if (!formData.birthDate || !formData.birthTime) return

    // Simulate Kuja Dosha calculation
    const birthDate = new Date(`${formData.birthDate}T${formData.birthTime}`)
    const birthHour = birthDate.getHours()
    
    // Kuja Dosha occurs when Mars is in certain houses or aspects
    const hasKujaDosha = Math.random() > 0.5
    const severity = hasKujaDosha ? ['Mild', 'Moderate', 'Strong'][Math.floor(Math.random() * 3)] : 'None'
    
    let description = ''
    if (hasKujaDosha) {
      description = 'Kuja Dosha can affect marriage timing and compatibility. Remedies include wearing red coral, performing Mars-related rituals, and choosing compatible partners.'
    }

    setResult({
      hasDosha: hasKujaDosha,
      severity,
      description,
      birthHour,
      remedies: hasKujaDosha ? [
        'Wear red coral gemstone',
        'Perform Mangal Shanti puja',
        'Chant Mars mantras',
        'Donate red items on Tuesdays'
      ] : []
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Kuja Dosha Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="kujaBirthDate">Birth Date</Label>
                <Input
                  id="kujaBirthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="kujaBirthTime">Birth Time</Label>
                <Input
                  id="kujaBirthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={calculateKujaDosha} className="w-full">
              Calculate Kuja Dosha
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">Kuja Dosha:</span>
                <Badge variant={result.hasDosha ? 'destructive' : 'secondary'}>
                  {result.hasDosha ? 'Present' : 'Not Present'}
                </Badge>
              </div>
              
              {result.hasDosha && (
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">Severity:</span>
                  <Badge variant="outline">{result.severity}</Badge>
                </div>
              )}
              
              {result.description && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{result.description}</AlertDescription>
                </Alert>
              )}
              
              {result.remedies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Remedies:</h4>
                  <ul className="space-y-1">
                    {result.remedies.map((remedy: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function KalasarpaCalculator() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: ''
  })
  const [result, setResult] = useState<any>(null)

  const calculateKalasarpa = () => {
    if (!formData.birthDate || !formData.birthTime) return

    // Simulate Kalasarpa Dosha calculation
    const hasKalasarpa = Math.random() > 0.6
    const type = hasKalasarpa ? ['Anant', 'Kulik', 'Vasuki', 'Shankhapal'][Math.floor(Math.random() * 4)] : 'None'
    
    let description = ''
    if (hasKalasarpa) {
      description = 'Kalasarpa Dosha occurs when all planets are positioned between Rahu and Ketu. It can cause delays, obstacles, and challenges in life.'
    }

    setResult({
      hasDosha: hasKalasarpa,
      type,
      description,
      remedies: hasKalasarpa ? [
        'Perform Kalasarpa Shanti puja',
        'Wear black thread with 9 knots',
        'Chant Rahu-Ketu mantras',
        'Donate black items on Saturdays'
      ] : []
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Kalasarpa Dosha Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="kalasarpaBirthDate">Birth Date</Label>
                <Input
                  id="kalasarpaBirthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="kalasarpaBirthTime">Birth Time</Label>
                <Input
                  id="kalasarpaBirthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={calculateKalasarpa} className="w-full">
              Calculate Kalasarpa Dosha
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">Kalasarpa Dosha:</span>
                <Badge variant={result.hasDosha ? 'destructive' : 'secondary'}>
                  {result.hasDosha ? 'Present' : 'Not Present'}
                </Badge>
              </div>
              
              {result.hasDosha && (
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">Type:</span>
                  <Badge variant="outline">{result.type}</Badge>
                </div>
              )}
              
              {result.description && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{result.description}</AlertDescription>
                </Alert>
              )}
              
              {result.remedies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Remedies:</h4>
                  <ul className="space-y-1">
                    {result.remedies.map((remedy: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MangalCalculator() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    gender: 'male'
  })
  const [result, setResult] = useState<any>(null)

  const calculateMangal = () => {
    if (!formData.birthDate || !formData.birthTime) return

    // Simulate Mangal Dosha calculation
    const birthDate = new Date(`${formData.birthDate}T${formData.birthTime}`)
    const birthHour = birthDate.getHours()
    
    const hasMangalDosha = Math.random() > 0.4
    const severity = hasMangalDosha ? ['Mild', 'Moderate', 'Strong'][Math.floor(Math.random() * 3)] : 'None'
    
    let description = ''
    if (hasMangalDosha) {
      description = 'Mangal Dosha (Manglik) can affect marriage timing and marital harmony. It occurs when Mars is positioned unfavorably in the birth chart.'
    }

    setResult({
      hasDosha: hasMangalDosha,
      severity,
      description,
      birthHour,
      remedies: hasMangalDosha ? [
        'Wear red coral gemstone',
        'Perform Mangal Shanti puja',
        'Marry another Manglik person',
        'Chant Mars mantras regularly'
      ] : []
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Mangal Dosha Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="mangalBirthDate">Birth Date</Label>
                <Input
                  id="mangalBirthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="mangalBirthTime">Birth Time</Label>
                <Input
                  id="mangalBirthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="mangalGender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={calculateMangal} className="w-full">
              Calculate Mangal Dosha
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">Mangal Dosha:</span>
                <Badge variant={result.hasDosha ? 'destructive' : 'secondary'}>
                  {result.hasDosha ? 'Present' : 'Not Present'}
                </Badge>
              </div>
              
              {result.hasDosha && (
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">Severity:</span>
                  <Badge variant="outline">{result.severity}</Badge>
                </div>
              )}
              
              {result.description && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{result.description}</AlertDescription>
                </Alert>
              )}
              
              {result.remedies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Remedies:</h4>
                  <ul className="space-y-1">
                    {result.remedies.map((remedy: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}