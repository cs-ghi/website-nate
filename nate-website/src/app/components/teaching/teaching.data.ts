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
                'Scale by 2 and by 3/2 at once: F(S) holds 2 × 3/2 = 3 copies of S.', 23),
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
          {
            title: 'Computing 3 × 3 determinants',
            blurb: 'Lecture Activity 7.8, the three properties in Proposition 7.10, and Example 7.11. ' +
              'These use the CAP\'s notation T_A and show the answers, so play them after students try the activity.',
            clips: [
              ch7('C13', 'C13_LA78', 'Lecture Activity 7.8, step by step',
                'Edges, base, height, sign: det A = 6, then det B = −4. The base is a parallelogram from LA 7.4.', 158),
              ch7('C14', 'C14_Reduction', 'Reduction Property',
                'When the top row is (c, 0, 0), the base lies in the yz-plane and c is the height, with a sign.', 66),
              ch7('C15', 'C15_ColumnSwap', 'Column Swapping Property',
                'Swapping two columns keeps the shape and the volume, but reverses the orientation.', 48),
              ch7('C16', 'C16_RowLinearity', 'Row Linearity Property',
                'Lift the edges out of the yz-plane one at a time. Each lift adds its own piece.', 66),
              ch7('C17', 'C17_Example711', 'Example 7.11',
                'The three properties in a row, ending with the pattern behind cofactor expansion (Def. 7.13).', 91),
            ],
          },
          {
            title: 'Reference: the CAP 7 matrices from LA 7.4 and LA 7.6',
            blurb: 'For each matrix: the image of the unit square, its area and orientation, and the check det = ad − bc.',
            sheet: { src: `${MAT223_CH7}/R00_ReferenceSheet.png`, label: 'All six on one page' },
            clips: [
              ch7('R01', 'R01_LA74A', 'LA 7.4: det A',
                'Base 2, height 1, positively oriented: det A = 2.', 31),
              ch7('R02', 'R02_LA74B', 'LA 7.4: det B',
                'A square of area 2, negatively oriented: det B = −2.', 40),
              ch7('R03', 'R03_LA76A', 'LA 7.6 P1: det A',
                'Long and thin, but its area is 1. The LA 7.5 slide shows why.', 47),
              ch7('R04', 'R04_LA76B', 'LA 7.6 P2: det B',
                'Area 19 and the orientation flips: det B = −19.', 42),
              ch7('R05', 'R05_LA76C', 'LA 7.6 P3: det C',
                'Both columns lie on y = 2x, so the plane collapses onto a line: det C = 0.', 40),
              ch7('R06', 'R06_LA76D', 'LA 7.6 P4: det D',
                'Area ½, positively oriented: det D = ½.', 43),
            ],
          },
        ],
      },
    ],
  },
];
