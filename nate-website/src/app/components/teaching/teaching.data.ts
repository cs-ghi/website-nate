import { Course, TeachingClip } from 'src/app/interfaces/teaching.model';

// Videos are 1080p H.264 with the index at the front (so playback starts
// before the file finishes downloading). Source and render scripts live with
// the course files, in mat223/ch7-manim/, not in this repo.
const MAT223_CH7 = 'assets/teaching/mat223/ch7';

function ch7(code: string, file: string, title: string, blurb: string, seconds: number): TeachingClip {
  return {
    code,
    title,
    blurb,
    seconds,
    src: `${MAT223_CH7}/videos/${file}.mp4`,
    poster: `${MAT223_CH7}/posters/${file}.jpg`,
  };
}

export const COURSES: Course[] = [
  {
    slug: 'mat223',
    code: 'MAT223',
    title: 'Linear Algebra I',
    term: 'Fall 2026',
    role: 'Instructor',
    institution: 'University of Toronto',
    blurb: 'Animations for lecture: how a linear map changes area and volume, and why that number is the determinant.',
    chapters: [
      {
        title: 'Chapter 7: Determinants',
        blurb:
          'How a linear map changes area and volume, and why that number is the determinant. ' +
          'The clips use the lecture notes\' notation: the unit square S, the unit cube C, ' +
          'and the images F(e₁), F(e₂), F(e₃) of the standard basis vectors.',
        groups: [
          {
            title: 'In the plane',
            clips: [
              ch7('C01', 'C01_ScaleOneDirection', 'Scaling one direction',
                'Stretching one direction by 3 multiplies area by 3.', 17),
              ch7('C02', 'C02_ScaleTwoDirections', 'Scaling two directions',
                'Stretch by 3, then squash by ½: the scaling factors multiply.', 21),
              ch7('C03', 'C03_Rotation', 'Rotation',
                'Rotating the plane never changes area.', 26),
              ch7('C04', 'C04_Shear', 'Shear',
                'A shear keeps the base and the height, so it keeps the area.', 44),
              ch7('C05', 'C05_Combination', 'Shear, then scale, then rotate',
                'Every matrix is a rotation times a scaling times a shear. Only the scaling changes area.', 39),
              ch7('C06', 'C06_CollapseToLine', 'Collapsing onto a line',
                'When the columns are parallel, the plane is squashed flat and the area is 0.', 25),
              ch7('C07', 'C07_CollapseToPoint', 'Collapsing to a point',
                'The zero matrix sends every vector to 0.', 17),
              ch7('C08', 'C08_OrientationFlip', 'Orientation',
                'When the two vectors cross, the orientation flips and the oriented area turns negative.', 43),
            ],
          },
          {
            title: 'In space',
            clips: [
              ch7('C09', 'C09_Scale3D', 'Scaling in three directions',
                'Volume multiplies too: 2 × 3 × ½ = 3.', 20),
              ch7('C10', 'C10_Rotation3D', 'Rotation in 3D',
                'Rotating space never changes volume, even when the matrix looks messy.', 26),
              ch7('C11', 'C11_Shear3D', 'Shear in 3D',
                'Like sliding a deck of cards: volume = (area of base) × height.', 30),
              ch7('C12', 'C12_Orientation3D', 'Orientation in 3D',
                'The right-hand rule, and what happens when F(e₃) passes through the floor.', 41),
            ],
          },
        ],
      },
    ],
  },
];
