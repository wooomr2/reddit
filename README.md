## Deploy 주소
https://reddit-wooomr2.vercel.app

## Next.js, TypeScript, Firebase, ChakraUI

* firebase Function
- Serverless Backend Code 실행
 
* 상태관리 Recoil, contextAPI


## SQL

Users
id PK

UserCommunities
id PK
userId FK
communityId FK

Communities
id PK

## noSql
<Option1>
user = {
  id,
  communities: [communityId]
}

community = {
  id,
  users: [userId] ===> user많아지면 array처리 비효율
}

<Option2>
추가
userCommunity = {
  userId,
  communityId
} ===>firebase에서 불가능

<Option3으로 결정>
user = {
  id,
  communitySnippets: [{
    communityId
    photoURL,
    communityName
  }]
}

community = {
  id,
  numOfMembers: Number,
}


# Custom-Hook:  useCommunity 3개 컴포넌트에 적용

# Firebase Transaction / batch
-Transaction : set of read and write
-Batch :set of write


# 6-14 firebase 백엔드 코드와 프론트 분리가 쉽지 않다

- firestore,firestorage와 연동되는 백엔드 코드
   customHook으로 만들어 별도 관리

- model(dto) 별도 폴더로 관리하자 사이즈 커지니까 찾기 귀찮

# 폴더구조 컴포넌트명 정리
- Community --> Widget
  -About --> Widget
  -About 내 관리자 커뮤니티 이미지 변경기능 ---> ManagerOption으로 분리
  
- Navbar --> Header
- RightContent --> Right


- Comments Post에서 독립



---firebase
communitySnippets --> userCommunities로 바꾸는게 안좋나