type HasColorGraphicsOptions = {
  color?: string
}

type HasFillGraphicsOptions = {
  fill?: boolean
} & HasColorGraphicsOptions

type HasStrokeGraphicsOptions = {
  stroke?: boolean
  lineWidth?: number
} & HasColorGraphicsOptions

type HasFillAndStrokeGraphicsOptions = HasFillGraphicsOptions & HasStrokeGraphicsOptions

type CircleGraphicsOptions = HasFillAndStrokeGraphicsOptions

type LineGraphicsOptions = {
  lineWidth?: number
} & HasColorGraphicsOptions

type RectangleGraphicsOptions = HasFillAndStrokeGraphicsOptions

type TriangleGraphicsOptions = HasFillAndStrokeGraphicsOptions

type PolygonGraphicsOptions = HasFillAndStrokeGraphicsOptions

type TextGraphicsOptions = {
  size?: number
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
} & HasColorGraphicsOptions