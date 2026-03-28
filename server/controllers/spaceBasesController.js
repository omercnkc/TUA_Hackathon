const SPACE_BASES = [
  {
    id: 'kennedy',
    name: 'Kenedy Space Center',
    country: 'ABD',
    lat: 28.5729,
    lng: -80.649,
    description:
      'Florida, USA. Başlıca fırlatma üssü. Mevcut hava koşulları optimizasyon için uygun seviyededir.',
    status: 'ACTIVE',
  },
  {
    id: 'baikonur',
    name: 'Baykonur Uzay Üssü',
    country: 'Kazakistan',
    lat: 45.965,
    lng: 63.305,
    description: 'İnsanlı uzay uçuşları için tarihî ve aktif bir fırlatma alanı.',
    status: 'ACTIVE',
  },
  {
    id: 'guiana',
    name: 'Kourou Guyane Uzay Merkezi',
    country: 'Fransa',
    lat: 5.232,
    lng: -52.805,
    description: 'Ekvatora yakın konumu sayesinde verimli yörünge çıkışları sağlar.',
    status: 'ACTIVE',
  },
  {
    id: 'tanegashima',
    name: 'Tanegashima Uzay Merkezi',
    country: 'Japonya',
    lat: 30.404,
    lng: 130.972,
    description: 'Pasifik üzerinde uydu ve bilim görevleri için kullanılır.',
    status: 'ACTIVE',
  },
]

export function listSpaceBases(_req, res) {
  res.json({ bases: SPACE_BASES })
}
