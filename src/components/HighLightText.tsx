import styled from '@emotion/styled';

interface IHighLightText {
  match: string;
  children: string;
}

export const HighLightText: React.FC<IHighLightText> = ({ match, children }) => {
  if (match && match !== '' && children.includes(match)) {
    let childrenSplitArr: string[] = children.split(match);
    let childrenElementArr: JSX.Element[] = [];

    childrenSplitArr.forEach((ele, idx) => {
      if (idx === 0 && childrenSplitArr[0] === '') {
        childrenElementArr.push(
          <HighLightStyled className="hight-light-text" key={'case1' + idx + ele}>
            {match}
          </HighLightStyled>
        );
      } else if (idx === childrenSplitArr.length - 1) {
        childrenElementArr.push(<span key={'case2' + idx + ele}>{ele}</span>);
      } else {
        childrenElementArr.push(<span key={'case3' + idx + ele}>{ele}</span>);
        childrenElementArr.push(
          <HighLightStyled className="hight-light-text" key={'case31' + idx + ele}>
            {match}
          </HighLightStyled>
        );
      }
    });

    return <span>{childrenElementArr}</span>;
  }

  return <span>{children}</span>;
};

const HighLightStyled = styled.span`
  color: rgb(102, 60, 0);
  background-color: rgb(255, 244, 229);
  font-weight: bold;
`;
