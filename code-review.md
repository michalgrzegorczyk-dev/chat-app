1. ustaw zaleznosci w projekcie (eslint). Wtedy bedziesz mial czarno na bialym czy importy sa dobre.
2. account to osobna domena?
3. shared/auth/util-auth przenioslbym do shared/util/auth
4. dodalbym odpowiednie prefixy dla libek (np chat dla chat, account dla account). Lepiej to wyglada niz lib
5. routes mozesz dodac do shared/util/route. ja najczesciej tworze tam obiekt o strukturze, ktora bedzie umozliwiala rozszerzanie
6. entities to interfejsy. Entity to obiekt (najczesciej klasa), ktora poza polami ma tez jakies pola, czasami jakas prosta logike. zamienilbym nazwe entities na models
7. 
