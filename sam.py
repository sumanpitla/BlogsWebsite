def lexicalOrder(n):
    i = 1
    res = []
    # while i <= 9 and i<=n:
    #     res.append(i)
    #     j=i
    #     if j*10 <= n:
    #         res.append(j*10)
    #     while j*i + 10 <= n and i*10<=n:
    #         # i = i + 10
    #         res.append(j+10)
    #         j=j+1
    #     i += 1
    # # print(res)
    

    return res
a=lexicalOrder(34)
print(a)