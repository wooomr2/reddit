## Deploy 주소
https://reddit-woomr815.vercel.app

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)

* 상태관리  Recoil
* firebase ( Function / 보안규칙 / Admin )


## 프로젝트 목표
- TypeScript / ChakraUI 적용
- Component 분리 & 재사용 적극 고려
- firebase사용시에도 backend 로직 분리해보기(Collection 별로 customHook에서 별도 관리)


## firebase 사용후기
1. 기존 관계형과 다른 구조로 DB 설계
- ex)
- SQL)
UserCommunity
  id PK
  userId FK
  communityId FK

- Firebase)
User Collection 내에 communitySnippets subCollection을 두는 방식으로 설계

2. 페이징 : Snapshot 쿼리 커서의 끝점을 저장 후 다음처리의 시작점으로 재활용하는 방식

3. Firebase Transaction / batch
- Transaction : set of read and write
- Batch :set of write

### 아쉬운 점
1. 기본 Index 생성과 full-text-search 지원 x --> Elastic,Algolia,Typesense 등의 third party library 활용해야함

2. firestore 내의 transaction/batch 처리는 가능하나, 
Authentication, Storage와 연동시 일괄 batch 기능 지원 x

3. Authentication의 user정보와 firestore 분리되어 있음 --> trigger function 별도 생성하여 firestore에 user정보 연동 필요
