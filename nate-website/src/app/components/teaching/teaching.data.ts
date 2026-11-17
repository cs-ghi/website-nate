import { Course, TeachingClip } from 'src/app/interfaces/teaching.model';

// Videos are 1080p H.264 with the index at the front (so playback starts
// before the file finishes downloading). Source and render scripts live with
// the course files, in mat223/ch7-manim/, mat223/ch8-manim/ and mat223/ch9-10-manim/, not in this repo.
const MAT223_CH7 = 'assets/teaching/mat223/ch7';
const MAT223_CH8 = 'assets/teaching/mat223/ch8';
const MAT223_CH9_10 = 'assets/teaching/mat223/ch9-10';

function clipsIn(dir: string) {
  return (code: string, file: string, title: string, blurb: string, seconds: number): TeachingClip => ({
    code,
    title,
    blurb,
    seconds,
    src: `${dir}/videos/${file}.mp4`,
    poster: `${dir}/posters/${file}.jpg`,
  });
}

const ch7 = clipsIn(MAT223_CH7);
const ch8 = clipsIn(MAT223_CH8);
// Chapters 9 and 10 were one CAP and share a folder. Their file names start with the order they're played in.
const ch9 = clipsIn(MAT223_CH9_10);

export const COURSES: Course[] = [
  {
    slug: 'mat223',
    code: 'MAT223',
    title: 'Linear Algebra I',
    term: 'Fall 2026',
    role: 'Instructor',
    institution: 'University of Toronto',
    blurb: 'Animations for lecture: determinants as area and volume, coordinates and change of basis, ' +
      'and eigenvalues and diagonalization.',
    chapters: [
      {
        title: 'Chapter 10: Similarity and Diagonalization',
        blurb:
          'The matrix of a linear map depends on the basis. In the basis of eigenvectors {(2, 1), (−1, 1)} the ' +
          'running example has the diagonal matrix D = diag(2, ½), and A = CDC⁻¹, where the columns of C are the eigenvectors.',
        groups: [
          {
            title: 'Defining matrices and similarity',
            sheet: { src: `${MAT223_CH9_10}/diagonalization-one-page.pdf`, label: 'Chapter 10 on one page (PDF)' },
            clips: [
              ch9('D00', '08_D00_AnotherGrid', 'The same map in another grid',
                'Read off B-coordinates on the grid of B = {(1, 0), (1, 1)} to find the matrix of T_A with respect to B (Theorem 10.1).', 56),
              ch9('D05', '09_D05_ThreeGrids', 'One map, three matrices',
                'The map T_A has a different matrix in each of three bases. Any two matrices of one map are similar (Definition 10.3).', 49),
              ch9('D06', '10_D06_TwoPaths', 'Two paths, one answer',
                'Multiply [x]_B by M, or convert to standard coordinates, apply A and convert back to B-coordinates. Both give the same answer, so M = P⁻¹AP (Theorem 10.4).', 58),
            ],
          },
          {
            title: 'Diagonalization',
            clips: [
              ch9('D01', '11_D01_TwoGrids', 'One map, two grids',
                'In a basis of eigenvectors T_A scales each basis vector, so its matrix is diagonal and A is diagonalizable (Definitions 10.6 and 10.7).', 56),
              ch9('D02', '12_D02_ThreeFactors', 'A = CDC⁻¹, one factor at a time',
                'C⁻¹ converts to eigenvector coordinates, D scales the axes by 2 and ½, and C converts back. The composition is T_A (Theorem 10.8).', 47),
              ch9('D07', '13_D07_DistinctEigenvalues', 'Distinct eigenvalues, independent eigenvectors',
                'A(v₁ + v₂) = 2v₁ + ½v₂ is not a multiple of v₁ + v₂. Eigenvectors for distinct eigenvalues are linearly independent (Proposition 10.9).', 60),
              ch9('D03', '14_D03_ShearOneLine', 'The shear: only one eigen-line',
                'The same characteristic polynomial as the identity, but only one line of eigenvectors, so a shear is not diagonalizable.', 30),
              ch9('D04', '15_D04_Powers', 'Powers',
                'Aⁿ = CDⁿC⁻¹. The v₂-component is halved at each step, and Aⁿ(S) becomes a long thin parallelogram of area 1.', 42),
            ],
          },
          {
            title: 'Lecture Activities 10.1 to 10.8',
            blurb: 'These use the CAP\'s numbers and show the answers, so try each activity first. ' +
              'The answer to Lecture Activity 10.4 is on the last slide of D01.',
            clips: [
              ch9('R06', 'R06_LA101', 'Lecture Activity 10.1',
                'F stretches along b₁ and fixes b₂, so in B-coordinates its matrix is diag(2, 1). Then the general case.', 37),
              ch9('R07', 'R07_LA102', 'Lecture Activity 10.2',
                'Rotate b₁ and b₂ by 90° and read off their B-coordinates: the matrix of the rotation with respect to B, and why it is similar to C.', 44),
              ch9('R08', 'R08_LA103', 'Lecture Activity 10.3',
                'B sends the unit cube to a solid of volume 2, and C sends it into a plane. Similar matrices have equal determinants, so B and C are not similar.', 41),
              ch9('R09', 'R09_LA105A1', 'Lecture Activity 10.5 P1',
                'Eigenvalues 2 and −1, each with a line of eigenvectors. A₁ = C₁D₁C₁⁻¹ one factor at a time; the −1 reverses orientation.', 50),
              ch9('R10', 'R10_LA105', 'Lecture Activities 10.5 and 10.6 in ℝ³',
                'A₂ and A₃ have the same characteristic polynomial, but only A₃ has enough eigenvectors to be diagonalizable.', 54),
              ch9('R11', 'R11_LA107', 'Lecture Activity 10.7',
                'Compute A = CDC⁻¹ from the given eigenvectors and eigenvalues, then check it on two vectors.', 50),
              ch9('R12', 'R12_LA108', 'Lecture Activity 10.8',
                'Each power of A₃ fixes the plane E₁ and doubles the line E₂. Computing A₃ⁿe₁ gives the first column of A₃ⁿ = C₃DⁿC₃⁻¹.', 48),
            ],
          },
        ],
      },
      {
        title: 'Chapter 9: Eigenvalues and Eigenvectors',
        blurb:
          'Nonzero vectors that a matrix sends to a multiple of themselves, and how to find them. The clips use one example: the matrix A ' +
          'with rows (3/2, 1) and (1/2, 1), which multiplies (2, 1) by 2 and (−1, 1) by ½.',
        groups: [
          {
            title: 'Eigenvectors and eigenspaces',
            sheet: { src: `${MAT223_CH9_10}/eigenvalues-one-page.pdf`, label: 'Chapter 9 on one page (PDF)' },
            clips: [
              ch9('E01', '01_E01_StayOnLine', 'Staying on the line',
                'A sends most vectors off the line they span. For an eigenvector v, Av is on the line through v (Definition 9.1).', 44),
              ch9('E02', '02_E02_EigenvectorSearch', 'Searching for eigenvectors',
                'Sweep a unit vector v around the circle and watch for Av to land on the line through v.', 49),
              ch9('E03', '03_E03_EigenvalueKinds', 'Kinds of eigenvalues',
                'The same eigenvectors with eigenvalues 2, 1, ½, 0 and −1. With eigenvalue 0 the matrix sends the plane onto a line.', 51),
              ch9('E04', '04_E04_EigenspaceNullSpace', 'Eigenspace = null space',
                'Av = ½v exactly when (A − ½I)v = 0, so the eigenvectors for ½ are the nonzero vectors of Nul(A − ½I) (Proposition 9.2).', 52),
            ],
          },
          {
            title: 'Finding eigenvalues',
            clips: [
              ch9('E05', '05_E05_WhereDetIsZero', 'Where det(A − λI) = 0',
                'A − λI is not invertible exactly when det(A − λI) = 0, and those λ are the eigenvalues (Proposition 9.5). Here A − λI sends the plane onto a line at λ = ½ and λ = 2.', 48),
              ch9('E06', '06_E06_RotationNoEigen', 'Rotations: no real eigenvalues',
                'A rotation sends every nonzero vector off the line it spans, and its characteristic polynomial has no real roots.', 33),
              ch9('E07', '07_E07_RotationAxis3D', 'Every rotation of space has an axis',
                'In ℝ³ the characteristic polynomial has odd degree, so there is always a real eigenvalue (Proposition 9.7).', 39),
            ],
          },
          {
            title: 'Lecture Activities 9.1 to 9.3',
            blurb: 'These use the CAP\'s numbers and show the answers, so try each activity first.',
            clips: [
              ch9('R01', 'R01_LA91', 'Lecture Activity 9.1',
                'Apply each matrix to its vector and check whether the result is a multiple of the vector. An eigenvalue can be 0.', 55),
              ch9('R02', 'R02_LA92', 'Lecture Activity 9.2',
                'A − 2I sends the line through (−2, 1) to 0. That line is the 2-eigenspace.', 22),
              ch9('R03', 'R03_LA93A', 'Lecture Activity 9.3: A',
                'A − λI sends the plane onto a line at λ = 0 and at λ = 2, the roots of det(A − λI).', 39),
              ch9('R04', 'R04_LA93B', 'Lecture Activity 9.3: B',
                'In ℝ³ every vector in the xy-plane is fixed (eigenvalue 1) and the line through (1, 1, 1) is scaled by 2 (eigenvalue 2).', 35),
              ch9('R05', 'R05_LA93C', 'Lecture Activity 9.3: C',
                'C − λI is invertible for every real λ, so C has no real eigenvalues.', 37),
            ],
          },
        ],
      },
      {
        title: 'Chapter 8: Coordinate Systems and Change of Basis',
        blurb:
          'Every vector is a unique linear combination of the vectors of a basis B, and the coefficients are its B-coordinates. ' +
          'The clips use one example: the basis B = {(2, 1), (−1, 1)} from the 3Blue1Brown pre-reading, ' +
          'and the vector x = (4, 5), whose B-coordinates are (3, 2).',
        groups: [
          {
            title: 'Coordinates',
            clips: [
              ch8('C18', 'C18_GridFromBasis', 'The grid of a basis',
                'The axes are the spans of the basis vectors. The other grid lines are parallel to them, through the integer combinations of b₁ and b₂.', 38),
              ch8('C20', 'C20_TwoAddresses', 'One vector, two coordinate vectors',
                'The same vector is 4e₁ + 5e₂ and 3b₁ + 2b₂: standard coordinates (4, 5), B-coordinates (3, 2).', 38),
              ch8('C21', 'C21_UniqueAddress', 'Exactly one coordinate vector',
                'For a dependent set some vectors have many coordinate vectors, and for a set that does not span some have none. A basis gives exactly one.', 52),
            ],
          },
          {
            title: 'Change of basis matrices',
            clips: [
              ch8('C22', 'C22_BtoE', 'From B-coordinates to standard coordinates',
                '3b₁ + 2b₂ is a matrix times a vector (Theorem 8.5).', 32),
              ch8('C23', 'C23_GridView', 'Why the matrix looks backwards',
                'As a map it sends the standard grid onto the B-grid, so it converts B-coordinates into standard coordinates.', 31),
              ch8('C24', 'C24_GoingBack', 'Going back',
                'The inverse matrix sends the B-grid back to the square grid, so it converts standard coordinates into B-coordinates.', 35),
              ch8('C25', 'C25_TwoBases', 'Two nonstandard bases',
                'Write each bᵢ in C-coordinates to get the columns of the change of basis matrix (Theorem 8.8).', 59),
            ],
          },
          {
            title: 'Change of basis in detail',
            blurb: 'How to write a combination of the b\'s in standard coordinates, one rule that gives every ' +
              'change of basis matrix, and how to compute them.',
            sheet: { src: `${MAT223_CH8}/change-of-basis-one-page.pdf`, label: 'Everything on one page (PDF)' },
            clips: [
              ch8('C27', 'C27_Unpacking', 'From 3b₁ + 2b₂ to 4e₁ + 5e₂',
                'Write each bᵢ in terms of e₁ and e₂ and collect terms: 3b₁ + 2b₂ = 4e₁ + 5e₂. Collecting terms is the matrix product.', 52),
              ch8('C28', 'C28_TwoViews', 'The plane in two coordinate systems',
                'The plane in B-coordinates next to the plane in standard coordinates, with the change of basis matrix converting between them.', 53),
              ch8('C29', 'C29_ColumnRule', 'The column rule',
                'Column j is the j-th input vector, written in the output basis. One rule for every case, and a quick check.', 52),
              ch8('C31', 'C31_Mistakes', 'Spot the mistake',
                'Three common wrong answers, each tested on x with its output plotted. Then three ways to check an answer.', 79),
              ch8('C32', 'C32_RowReduce', 'Row reducing [C | B]',
                'Row reduce [c₁ c₂ | b₁ b₂] once and the right block is the change of basis matrix, also inside a plane in ℝ³.', 49),
            ],
          },
          {
            title: 'Lecture Activities 8.2, 8.4 and 8.5',
            blurb: 'These use the CAP\'s numbers and show the answers, so try each activity first.',
            clips: [
              ch8('C19', 'C19_LA82', 'Lecture Activity 8.2',
                'Read off coordinates on both grids: u = w and v = z, and 3e₁ + 6e₂ = 5b₁ + b₂.', 42),
              ch8('C30', 'C30_LA84', 'Lecture Activity 8.4',
                'P1 by writing the b\'s in standard coordinates, P2 step by step, P3 by row reduction, and what the columns of the inverse are.', 96),
              ch8('C26', 'C26_LA85', 'Lecture Activity 8.5',
                'The plane V in ℝ³ with its C-grid. Writing vectors of V in C-coordinates gives the 2 × 2 matrices.', 79),
            ],
          },
        ],
      },
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
                'Scale by 2 and by 3/2 at once: F(S) has area 2 × 3/2 = 3.', 23),
              ch7('C03', 'C03_Rotation', 'Rotation',
                'Rotating the plane never changes area.', 26),
              ch7('C04', 'C04_Shear', 'Shear',
                'A shear keeps the base and the height, so it keeps the area.', 44),
              ch7('C05', 'C05_Combination', 'Shear, then scale, then rotate',
                'Every matrix is a rotation times a scaling times a shear. Only the scaling changes area.', 39),
              ch7('C06', 'C06_CollapseToLine', 'Collapsing onto a line',
                'When the columns are parallel, F sends the plane onto a line and the area is 0.', 25),
              ch7('C07', 'C07_CollapseToPoint', 'Collapsing to a point',
                'The zero matrix sends every vector to 0.', 17),
              ch7('C08', 'C08_OrientationFlip', 'Orientation',
                'When F(e₂) passes to the other side of F(e₁), the orientation reverses and the signed area becomes negative.', 43),
            ],
          },
          {
            title: 'In space',
            clips: [
              ch7('C09', 'C09_Scale3D', 'Scaling in three directions',
                'Volume multiplies too: 2 × 3 × ½ = 3.', 20),
              ch7('C10', 'C10_Rotation3D', 'Rotation in 3D',
                'A rotation of space does not change volume, whatever its matrix entries.', 26),
              ch7('C11', 'C11_Shear3D', 'Shear in 3D',
                'Each horizontal cross-section shifts sideways, so volume = (area of base) × height.', 30),
              ch7('C12', 'C12_Orientation3D', 'Orientation in 3D',
                'The right-hand rule, and what happens when F(e₃) passes through the xy-plane.', 41),
            ],
          },
          {
            title: 'Computing 3 × 3 determinants',
            blurb: 'Lecture Activity 7.8, the three properties in Proposition 7.10, and Example 7.11. ' +
              'These use the CAP\'s notation T_A and show the answers, so try each activity first.',
            clips: [
              ch7('C13', 'C13_LA78', 'Lecture Activity 7.8, step by step',
                'Edges, base, height, sign. The base keeps its sign: det A = 3 × 2 = 6 and det B = 2 × (−2) = −4.', 171),
              ch7('C14', 'C14_Reduction', 'Reduction Property',
                'The base lies in the yz-plane and c is the height. Moving the top face parallel to the base is a shear.', 76),
              ch7('C15', 'C15_ColumnSwap', 'Column Swapping Property',
                'Swapping two columns keeps the shape and the volume, but reverses the orientation.', 48),
              ch7('C16', 'C16_RowLinearity', 'Row Linearity Property',
                'Raise one edge at a time, then all three: 8 = 2 + 2 + 4. Then why the volumes add.', 108),
              ch7('C17', 'C17_Example711', 'Example 7.11',
                'The three properties applied in turn, ending with the pattern of cofactor expansion (Def. 7.13).', 91),
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
                'Both columns lie on y = 2x, so C sends the plane onto a line: det C = 0.', 40),
              ch7('R06', 'R06_LA76D', 'LA 7.6 P4: det D',
                'Area ½, positively oriented: det D = ½.', 43),
            ],
          },
        ],
      },
    ],
  },
];
