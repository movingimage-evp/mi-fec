import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import styled from '@emotion/styled';
import { TOrder } from './VideosManger';

export interface ITableHeadCell {
  active?: boolean;
  setSorting?: (sortBy: string, sortAs: TOrder) => void;
  children?: string;
  sortByColumn?: string;
  sortByAs?: TOrder;
  valueKey?: string;
}
export const TableHeadCell: React.FC<ITableHeadCell> = ({ active, setSorting, sortByAs, valueKey, children }) => {
  if (valueKey && setSorting) {
    return (
      <TableHeadCellStyled
        className={active ? 'active-sorting' : ''}
        onClick={() => {
          setSorting(valueKey, !sortByAs || sortByAs === 'des' ? 'asc' : 'des');
        }}>
        <span>
          {children}
          {!active && <SyncAltIcon sx={{ fontSize: 15 }} className={'not-sorted'} />}
          {active && (
            <span>
              <SouthOutlinedIcon sx={{ fontSize: 15 }} />
              <SortOutlinedIcon sx={{ fontSize: 15 }} className={sortByAs} />
            </span>
          )}{' '}
        </span>
      </TableHeadCellStyled>
    );
  } else {
    return (
      <TableHeadCellStyled>
        <span>{children}</span>
      </TableHeadCellStyled>
    );
  }
};

const TableHeadCellStyled = styled.span`
  font-weight: bold;
  cursor: pointer;
  &.active-sorting {
    color: #1976d2;
  }

  .not-sorted {
    transform: rotate(90deg);
    color: #999;
  }

  .asc {
    transform: rotate(180deg);
  }
`;
